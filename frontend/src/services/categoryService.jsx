import apiHelper from '../utils/Url'


const categoryServices = {
    getAllCategoryList : async ()=> {
        const res = await apiHelper.get('/product-category/getallcategory')
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