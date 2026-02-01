import apiHelper from '../utils/Url'

const subadminServices = {
    getAllSubadmins : async ()=> {
        const res = await apiHelper.get('/subadmin/listsubadmin')
        return  res.data;
    },
    addSubadmin: (payload) => apiHelper.post('/subadmin/addsubadmin',payload),
    editSubadmin: (payload) =>{
        console.log("payload",payload)
        apiHelper.post('/subadmin/editsubadmin/'+payload._id,payload)},
    deleteSubadmin: async(id) =>{ 
        const res  = await  apiHelper.delete('/subadmin/deletesubadmin/'+id)
        return res
    },
    subAdminLogin: (payload) => apiHelper.post('/subadmin/subadminlogin',payload),
}

export default subadminServices;