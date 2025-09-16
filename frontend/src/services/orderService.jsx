import apiHelper from '../utils/Url'


const orderServices = {
    getOrderById : async (id)=> {
        const res = await apiHelper.get('/order/getorder/'+id)
        return res.data;
    },
    getAllOrders : async ()=> {
        const res = await apiHelper.get('/order/getallorders')
        return  res.data;
    },
    getMyOrders : async (id)=> {
        const res = await apiHelper.get('/order/getmyorders')
        return res.data;
    },
    addOrders: (payload) => apiHelper.post('/order/addorder',payload),
    editOrders: (payload) =>{
        console.log("payload",payload)
        apiHelper.post('/order/updateorder/'+payload._id,payload)},
    deleteNotes: async(id) =>{ 
        const res  = await  apiHelper.delete('/order/deleteorder/'+id)
        return res
    }
}

export default orderServices;