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
    getAllUser:async (params)=>{
        const { page, 
            limit, 
            search, 
            status, 
            department, 
            role, 
            sortField, 
            sortDirection  } = params || {};
        
        // Build query string
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        if (department) queryParams.append('department', department);
        if (role) queryParams.append('role', role);
        if (sortField) queryParams.append('sortField', sortField);
        if (sortDirection) queryParams.append('sortDirection', sortDirection);

        const res = await apiHelper.get(`/user/getalluser?${queryParams.toString()}`);
        return res.data;
    },
    updateUser:(payload) => {
        console.log("update payload",payload);
        const res  = apiHelper.post('/user/updateuser/'+payload.id,payload,{
        headers: { "Content-Type": "multipart/form-data" }})
        return res;
    },
    deleteUser:(payload) => apiHelper.delete('/user/deleteuser/'+payload.id)
}

export default userServices;