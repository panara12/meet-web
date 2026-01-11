import apiHelper from '../utils/Url'


const paymentServices = {
    addPayment : (payload)=> apiHelper.post('/payment/addpayment',{
        payment_client: payload.payment_client,
        payment_salesman: payload.payment_salesman,
        payment_amount:payload.payment_amount,
        payment_type:payload.payment_type,
        order_with_payment:payload.order_with_payment,
        status:payload.status}),
    GetAllPayments : async () => await apiHelper.get('/payment/getallpayments'),
    UpdatePaymentStatus : (payload) => apiHelper.post(`/payment/updatepaymentstatus/${payload.paymentId}`,{
        status:payload.status
    })
    
}

export default paymentServices;