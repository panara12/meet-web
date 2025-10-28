import apiHelper from '../utils/Url'


const userServices = {
    addUser: (payload) => apiHelper.post('/user/adduser',payload,{
        headers: { "Content-Type": "multipart/form-data" }
    }),
    getUserById:async (payload) => {
        const res  = await apiHelper.get('/user/getuser/'+payload.id,)
        return res;
    },
    getAllByRoleUser:async (payload)=>{
        const res = await apiHelper.post('/user/getbyuserrole',payload);
        return res;
    },
    getAllUser:async ()=>{
        const res = await apiHelper.get('/user/getalluser');
        return res;
    },
    updateUser:(payload) => apiHelper.post('/user/updateuser/'+payload.id,payload,{
        headers: { "Content-Type": "multipart/form-data" }
    }),
    deleteUser:(payload) => apiHelper.delete('/user/deleteuser/'+payload.id)
}

export default userServices;