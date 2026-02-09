import apiHelper from '../utils/Url'

const locationServices = {
    //about the location apis
    AddLocation : async (payload) => await apiHelper.post('/location/locationEntry',payload),
    GetLocationByUserId : async (payload) => await apiHelper.get(`/location/latestLocation/${payload.userId}`),
    GetPathPointsByUserId : async (payload) => await apiHelper.post(`/location/pathPoints`, payload),
}

export default locationServices;