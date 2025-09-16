import apiHelper from '../utils/Url'


const paymentServices = {
    addPayment : (payload)=> apiHelper.post('/payment/addpayment',{
        payment_client: payload.payment_client,
        payment_amount:payload.payment_amount,
        payment_type:payload.payment_type,
        payment_date:payload.payment_date,
        order_with_payment:payload.order_with_payment}),
    
}

export default paymentServices;