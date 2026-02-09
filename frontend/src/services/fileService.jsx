import apiHelper from '../utils/Url'

const fileServices = {
    addFile : (payload) => apiHelper.post('/files/addfile', payload,{
        headers: { "Content-Type": "multipart/form-data" }
    }),
    getFilesById : (staffId) => apiHelper.get(`/files/getfilesbystaff/${staffId}`),
    deleteFile : (payload) => apiHelper.delete(`/files/deletefile/${payload.id}`),
    getWeekFiles : () => apiHelper.get('/files/getfilesbyweek')
}

export default fileServices;