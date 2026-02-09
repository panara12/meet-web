import apiHelper from '../utils/Url'


const tenantServices = {
    addTenant: (payload) => apiHelper.post('/tenent/addtenant',payload)
}

export default tenantServices;