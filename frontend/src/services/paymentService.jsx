import apiHelper from '../utils/Url'


const paymentServices = {
    addPayment : (payload)=> apiHelper.post('/payment/addpayment',{
        payment_client: payload.payment_client,
        payment_salesman: payload.payment_salesman,
        payment_amount:payload.payment_amount,
        payment_type:payload.payment_type,
        order_with_payment:payload.order_with_payment,
        status:payload.status}),
    GetAllPayments: async (params) => {
        const { page, limit, search, status, salesman, sortField, sortDirection } = params || {};
        
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        if (salesman) queryParams.append('salesman', salesman);
        if (sortField) queryParams.append('sortField', sortField);
        if (sortDirection) queryParams.append('sortDirection', sortDirection);

        const res = await apiHelper.get(`/payment/getallpayments?${queryParams.toString()}`);
        return res.data;
    },
    UpdatePaymentStatus : (payload) => apiHelper.post(`/payment/updatepaymentstatus/${payload.paymentId}`,{
        status:payload.status
    })
    
}

export default paymentServices;