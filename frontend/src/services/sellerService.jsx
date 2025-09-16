import apiHelper from '../utils/Url'


const sellerServices = {
    getSellerList : async ()=> {
        const res = await apiHelper.get('/seller/allseller')
        return res.data;
    },
    addSeller : (payload)=> apiHelper.post('/seller/addseller',payload)
        
}

export default sellerServices;