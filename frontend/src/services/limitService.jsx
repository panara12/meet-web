import apiHelper from '../utils/Url'

const limitServices = {
    //about the limit apis
    GetLimits : async () => await apiHelper.get('/limit/getlimits'),
    UpdateLimits: (payload) => {
        // console.log("Updating limits with payload:", payload)
        apiHelper.post('/limit/updatelimits',payload)
        return true
    }
}

export default limitServices;