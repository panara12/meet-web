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
        const User = req.db.model("User");

        // Extract query parameters
        const page          = parseInt(req.query.page)  || 1;
        const limit         = parseInt(req.query.limit) || 10;
        const search        = req.query.search || '';
        const status        = req.query.status;
        const salesman      = req.query.salesman;
        let   sortField     = req.query.sortField || 'createdAt';
        const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

        // ── Base DB filter (only hard filters that go to MongoDB) ──────────────
        const filter = {};
        if (salesman && salesman !== 'all') {
            filter.payment_salesman = salesman;
        }

        // ── Fetch payments + salesman list in parallel ─────────────────────────
        const [rawPayments, salesmanList] = await Promise.all([
            Payment.find(filter)
                .populate('payment_client')
                .populate('payment_salesman')
                .lean(),
            User.find({ role: "salesman" })
                .select('_id firstName lastName email')
                .sort({ firstName: 1 })
                .lean()
        ]);

        // ── Apply search filter (post-populate, on real string fields) ─────────
        let filteredPayments = rawPayments;
        if (search) {
            const isNumber    = !isNaN(parseFloat(search));
            const searchLower = search.toLowerCase();
            filteredPayments  = filteredPayments.filter(payment => {
                const clientName        = payment.payment_client?.name?.toLowerCase()        || '';
                const salesmanFirstName = payment.payment_salesman?.firstName?.toLowerCase() || '';
                const salesmanEmail     = payment.payment_salesman?.email?.toLowerCase()     || '';
                const amountMatch       = isNumber && payment.payment_amount === parseFloat(search);
                return (
                    clientName.includes(searchLower)        ||
                    salesmanFirstName.includes(searchLower) ||
                    salesmanEmail.includes(searchLower)     ||
                    amountMatch
                );
            });
        }

        // ── Attach currentStatus to every payment ──────────────────────────────
        filteredPayments = filteredPayments.map(payment => {
            const latestStatus = payment.status && payment.status.length > 0
                ? payment.status[payment.status.length - 1]
                : { status: 'pending', date: payment.createdAt };
            return {
                ...payment,
                currentStatus:       latestStatus.status,
                latestStatusDetails: latestStatus
            };
        });

        // ── STATS: computed on full filtered set, BEFORE status filter ─────────
        // Rules:
        //   - salesman filter ON  → stats only for that salesman
        //   - search filter ON    → stats only for search results
        //   - status filter ON    → stats still show ALL statuses (not just filtered one)
        //   - NEVER limited to current page only
        const statsBase          = filteredPayments;
        const totalPendingCount  = statsBase.filter(p => p.currentStatus === 'pending').length;
        const totalApprovedCount = statsBase.filter(p => p.currentStatus === 'approved').length;
        const totalRejectedCount = statsBase.filter(p => p.currentStatus === 'rejected').length;
        const totalPendingAmount = statsBase
            .filter(p => p.currentStatus === 'pending')
            .reduce((sum, p) => sum + (p.payment_amount || 0), 0);

        // ── Apply status filter AFTER stats ────────────────────────────────────
        let statusFilteredPayments = filteredPayments;
        if (status && status !== 'all') {
            statusFilteredPayments = filteredPayments.filter(p => p.currentStatus === status);
        }

        // ── Sort ───────────────────────────────────────────────────────────────
        if (sortField === 'amount') sortField = 'payment_amount';
        if (sortField === 'status') sortField = 'currentStatus';
        if (sortField === 'date')   sortField = 'createdAt';

        statusFilteredPayments.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            if (aValue === undefined || aValue === null) return 1;
            if (bValue === undefined || bValue === null) return -1;
            if (typeof aValue === 'string') return aValue.localeCompare(bValue) * sortDirection;
            if (aValue < bValue) return -1 * sortDirection;
            if (aValue > bValue) return 1  * sortDirection;
            return 0;
        });

        // ── Paginate ───────────────────────────────────────────────────────────
        const totalRecords = statusFilteredPayments.length;
        const totalPages   = Math.ceil(totalRecords / limit);
        const skip         = (page - 1) * limit;
        const payments     = statusFilteredPayments.slice(skip, skip + limit);

        manualLog("payments fetched successfully");

        res.status(200).send({
            message: "payments fetched successfully",
            success: true,
            payments: {
                data: payments,
                pagination: {
                    currentPage:  page,
                    totalPages:   totalPages,
                    totalRecords: totalRecords,
                    limit:        limit,
                    hasNextPage:  page < totalPages,
                    hasPrevPage:  page > 1
                }
            },
            // Stats reflect full filtered dataset — never just the current page
            stats: {
                totalPendingCount,
                totalApprovedCount,
                totalRejectedCount,
                totalPendingAmount
            },
            salesmen: salesmanList
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