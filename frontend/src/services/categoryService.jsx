import apiHelper from '../utils/Url'


const categoryServices = {
    getAllCategoryList : async ()=> {
        const res = await apiHelper.get('/product-category/getallcategory')
        return res.data;
    },
    getAllCategoryWithPagination:async (params)=> {
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

        const res = await apiHelper.get(`/product-category/getallcategorywithpages?${queryParams.toString()}`);
        return res.data;
    },
    updateCategory : async (payload)=> {
        // console.log("Payload in service:", payload);
        const res = await apiHelper.post('/product-category/updatecategory/'+payload.id,payload.formDataToSend)
        return res.data;
    },
    addCategory:async (payload)=>{
        const res = await apiHelper.post('/product-category/addcategory',payload)
        return res.data;
    },
    deleteCategory: async (payload)=>{
        const res = await apiHelper.delete('/product-category/deletecategory/'+payload.id)
        return res.data;
    }
}

export default categoryServices;