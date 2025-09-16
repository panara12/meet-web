import apiHelper from '../utils/Url'


const userServices = {
    addUser: (payload) => apiHelper.post('/user/adduser',payload),
    getUserById:async (id) => {
        const res  = await apiHelper.get('/user/getuser'+id)
        return res;
    },
    getAllUser:async (payload)=>{
        const res = await apiHelper.post('/user/getbyuserrole',payload);
        return res;
    },
    updateUser:(id,payload) => apiHelper.post('/user/updateuser/'+id,payload),
    deleteUser:(id) => apiHelper.delete('/user/deleteuser'+id)
}

export default userServices;