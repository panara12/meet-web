import apiHelper from '../utils/Url'

console.log(apiHelper);
const authServices = {
    login : (payload)=> apiHelper.post('/auth/login',{username: payload.username,password:payload.password}, {headers:{ "x-tenent-domain":payload.domain }})
}

export default authServices;