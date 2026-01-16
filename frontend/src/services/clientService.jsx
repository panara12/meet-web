import apiHelper from '../utils/Url'

const clientServices = {
    getSellerList: async (params) => {
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
        
        const res = await apiHelper.get(`/seller/allseller?${queryParams.toString()}`);
        return res.data;
    },
    getSellerById: async (payload) => {
        const res = await apiHelper.get('/seller/getseller/' + payload.id);
        return res.data;
    },
    addSeller: (payload) => apiHelper.post('/seller/addseller', payload),
    updateSeller: async (payload) => {
        console.log("update method", payload);
        const res = await apiHelper.post('/seller/updateseller/' + payload.id, payload);
        console.log("response data", res);
        return res;
    },
    deleteSeller: async (payload) => {
        const res = await apiHelper.delete('/seller/deleteseller/' + payload.id);
        return res.data;
    }
}

export default clientServices;