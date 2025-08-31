import apiHelper from '../utils/Url'


const authServices = {
    login : (payload)=> apiHelper.post('/auth/login',{username: payload.username,password:payload.password}),
    getLoggedUser : async ()=> {
        const res = await apiHelper.get('/auth/me')
        return res.data.user;
    }
}

export default authServices;