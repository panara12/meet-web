import apiHelper from '../utils/Url'

const distributerServices = {
    //about the salesman apis
    getDistributer : () =>apiHelper.get('/distributer/distributerdata')
}

export default distributerServices;