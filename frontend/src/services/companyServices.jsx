import apiHelper from '../utils/Url'

const companyServices = {
    //about the salesman apis
    AddCompany : async (payload) => await apiHelper.post('/company/addcompany',payload),
    getAllCompany:async (params) => {
        const { page, limit, search, status, priority, sortField, sortDirection } = params || {};
        
        // Build query string
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        if (priority) queryParams.append('priority', priority);
        if (sortField) queryParams.append('sortField', sortField);
        if (sortDirection) queryParams.append('sortDirection', sortDirection);

        const res = await apiHelper.get(`/company/getallcompany?${queryParams.toString()}`)
        return res.data;
    },
    UpdateCompany: (payload) => apiHelper.post('/company/updatecompany/'+payload.id,payload.updates),
    deleteCompany:(payload)=> apiHelper.delete('/company/deletecompany/'+payload.id)
}

export default companyServices;