const express = require('express')
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const router = express.Router();


router.post('/addpayment',user_session_checker("add_payment"),async(req,res)=>{
    manualLog("entered in add payment method")
    try {
        const {payment_client,payment_amount,payment_type,order_with_payment,status} = req.body
        const Payment = req.db.model("Payment")
        const new_payment = await Payment.create({
            payment_client,
            payment_salesman:req.session.user.tenant_user_id,
            payment_amount,
            payment_type,
            order_with_payment,
            status:[status]
        })
        manualLog("payment added successfully",new_payment)
        res.status(200).send({
            message:"payment added successfully",
            success:true,
            payment:new_payment
        })
    } catch (error) {
        manualLog("something broke in payment add",error)
        console.log(error,"something broke in the add payment");
        res.status(500).send({message:"something went wronge",error});
    }
})

router.get('/getallpayments', user_session_checker("view_payments"), async (req, res) => {
    manualLog("entered in get all payments method");
    try {
        const Payment = req.db.model("Payment");
        
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status;
        let sortField = req.query.sortField || 'createdAt';
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
        
        // Build filter object
        const filter = {};
        
        // Search filter
        if (search) {
            const isNumber = !isNaN(parseFloat(search));
            
            filter.$or = [
                { payment_client: { $regex: search, $options: 'i' } },
                { payment_salesman: { $regex: search, $options: 'i' } }
            ];
            
            if (isNumber) {
                filter.$or.push({ payment_amount: parseFloat(search) });
            }
        }

        // Build sort object
        const sort = {};
        if(sortField == "amount"){
            sortField = "payment_amount"
        }
        console.log("sort feilds",sortField)
        sort[sortField] = sortDirection;
        console.log("sort array",sort);

        // Fetch all payments that match the search filter
        let allPayments = await Payment.find(filter)
            .populate('payment_client')
            .populate('payment_salesman')
            .lean();

        // Add latest status and filter by status if needed
        allPayments = allPayments.map(payment => {
            const latestStatus = payment.status && payment.status.length > 0
                ? payment.status[payment.status.length - 1]
                : { status: 'pending', date: payment.createdAt };
            
            return {
                ...payment,
                currentStatus: latestStatus.status,
                latestStatusDetails: latestStatus
            };
        });

        // Filter by status if provided
        if (status) {
            allPayments = allPayments.filter(p => p.currentStatus === status);
        }

        // Sort the results
        allPayments.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            
            if (aValue < bValue) return -1 * sortDirection;
            if (aValue > bValue) return 1 * sortDirection;
            return 0;
        });

        // Calculate pagination
        const totalRecords = allPayments.length;
        const totalPages = Math.ceil(totalRecords / limit);
        const skip = (page - 1) * limit;
        
        // Paginate results
        const payments = allPayments.slice(skip, skip + limit);

        manualLog("payments fetched successfully");
        
        res.status(200).send({
            message: "payments fetched successfully",
            success: true,
            payments: {
                data: payments,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalRecords: totalRecords,
                    limit: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
        
    } catch (error) {
        manualLog("something broke in payment get all", error);
        console.log(error, "something broke in the get all payments");
        res.status(500).send({ 
            message: "something went wrong", 
            error: error.message 
        });
    }
});

router.post('/updatepaymentstatus/:id',user_session_checker("update_payment_status"),async(req,res)=>{
    manualLog("entered in update payment status method")
    try {
        const {status} = req.body
        const Payment = req.db.model("Payment")
        const updated_payment = await Payment.findByIdAndUpdate(req.params.id,{
            $push:{status:status}
        })
        manualLog("payment status updated successfully",updated_payment)
        res.status(200).send({
            message:"payment status updated successfully",
            success:true,
            payment:updated_payment
        })
    } catch (error) {
        manualLog("something broke in payment update status",error)
        console.log(error,"something broke in the update payment status");
        res.status(500).send({message:"something went wronge",error});
    }
})

module.exports = router