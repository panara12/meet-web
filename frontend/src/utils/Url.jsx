import axios from 'axios';

// Development - Backend URL
const apiHelper = axios.create({
    baseURL:"https://api.voidvortextech.com",
    withCredentials:true,
    headers: {
        'Content-Type': 'application/json',
    },
})



// Production - Backend URL
// const uri = "https://meet-web-pydw.onrender.com"
// const apiHelper = axios.create({
//     baseURL:"https://meet-web-pydw.onrender.com",
//     withCredentials:true
// })

// Email API Endpoint: ${uri}/email/emailTo
export default apiHelper
