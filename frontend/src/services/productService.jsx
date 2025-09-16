import apiHelper from '../utils/Url'


const productServices = {
    getAllProductList : async ()=> {
        const res = await apiHelper.get('/product/getallproduct')
        return res.data;
    }
}

export default productServices;