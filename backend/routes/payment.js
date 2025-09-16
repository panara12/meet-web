const express = require('express')
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const router = express.Router();


router.post('/addpayment',user_session_checker("add_payment"),async(req,res)=>{
    manualLog("entered in add payment method")
    try {
        const {payment_client,payment_amount,payment_type,payment_date,order_with_payment} = req.body
        const Payment = req.db.model("Payment")
        const new_payment = await Payment.create({
            payment_client,
            payment_salesman:req.session.user.user_id,
            payment_amount,
            payment_type,
            payment_date,
            order_with_payment
        })
        manualLog("payment added successfully")
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

module.exports = router