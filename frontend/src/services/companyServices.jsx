import apiHelper from '../utils/Url'

const companyServices = {
    //about the salesman apis
    AddCompany : async (payload) => await apiHelper.post('/company/addcompany',payload),
    getAllCompany:async () =>await apiHelper.get('/company/getallcompany'),
    UpdateCompany: (payload) => apiHelper.post('/company/updatecompany/'+payload.id,payload.updates),
    deleteCompany:(payload)=> apiHelper.delete('/company/deletecompany/'+payload.id)
}

export default companyServices;