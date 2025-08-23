import apiHelper from '../utils/Url'

console.log(apiHelper);
const authServices = {
    login : (payload)=> apiHelper.post('/auth/login',payload)
}

export default authServices;