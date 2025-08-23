import axios from 'axios';

// Development - Backend URL
const apiHelper = axios.create({
    baseURL:"http://localhost:4000",
    withCredentials:true,
    headers: {
        'Content-Type': 'application/json',
        "x-tenent-domain":"radhemarketing"
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