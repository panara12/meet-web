import apiHelper from '../utils/Url'


const productServices = {
    getAllProductList : async (params)=> {
        const { page, limit, search, status,category, companyId, priority, sortField, sortDirection } = params || {};
        
        // Build query string
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        if (category) queryParams.append('category', category);
        if (companyId) queryParams.append('companyId', companyId);
        if (sortField) queryParams.append('sortField', sortField);
        if (sortDirection) queryParams.append('sortDirection', sortDirection);

        const res = await apiHelper.get(`/product/getallproduct?${queryParams.toString()}`);
        return res.data;
    },
    getProductById : async (payload)=> {
        const res = await apiHelper.get('/product/getproduct/'+payload.id)
        return res.data;
    },
    updateProduct : async (payload)=> {
        // console.log("Payload in service:", payload);
        const res = await apiHelper.post('/product/updateproduct/'+payload.id,payload.formDataToSend,{
        headers: { "Content-Type": "multipart/form-data" }
    })
        return res.data;
    },
    addProduct:async (payload)=>{
        const res = await apiHelper.post('/product/addproduct',payload,{
        headers: { "Content-Type": "multipart/form-data" }
    })
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