import apiHelper from '../utils/Url'


const productServices = {
    getAllProductList : async ()=> {
        const res = await apiHelper.get('/product/getallproduct')
        return res.data;
    },
    getProductById : async (payload)=> {
        const res = await apiHelper.get('/product/getproduct/'+payload.id)
        return res.data;
    },
    updateProduct : async (payload)=> {
        const res = await apiHelper.post('/product/updateproduct/'+payload.id,payload.product)
        return res.data;
    },
    addProduct:async (payload)=>{
        const res = await apiHelper.post('/product/addproduct',payload)
        return res.data;
    },
    deleteProduct: async (payload)=>{
        const res = await apiHelper.delete('/product/deleteproduct/'+payload.id)
        return res.data;
    },
    deleteProductByCompany: async (payload)=>{
        const res = await apiHelper.delete('/product/deleteproductbycompany/'+payload.id)
        return res.data;
    },
    getAllProductCountByCompany: async (payload)=>{
        const res = await apiHelper.get('/product/productcount/'+payload.id)
        return res.data;
    }

}

export default productServices;