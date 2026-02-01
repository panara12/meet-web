import apiHelper from '../utils/Url'

const distributerServices = {
    //about the salesman apis
    getDistributer : (payload) =>apiHelper.post('/distributer/distributerdata/'+payload.id)
}

export default distributerServices;