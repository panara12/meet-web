import apiHelper from '../utils/Url'


const authServices = {
    login : (payload)=> apiHelper.post('/auth/login',{username: payload.username,password:payload.password}),
    getLoggedUser : async ()=> {
        const res = await apiHelper.get('/auth/me')
        return res.data.user;
    },
    verifyOtp:(payload)=> apiHelper.post('/auth/checkotp',{email:payload.userEmail,otp:payload.otp}),
    resetPassword:(payload)=> apiHelper.post('/auth/resetpassword',{email:payload.userEmail,password:payload.newPassword})
}

export default authServices;