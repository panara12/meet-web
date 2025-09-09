import apiHelper from '../utils/Url'


const packagingServices = {
    getSellerList : async ()=> {
        const res = await apiHelper.get('/seller/allseller')
        return res.data;
    }
}

export default packagingServices;