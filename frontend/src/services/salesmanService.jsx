import apiHelper from '../utils/Url'


const salesmanServices = {
    getSalesmanById : async (id)=> {
        const res = await apiHelper.get('/user/getuser/'+id)
        return res.data;
    },
    getAllNotes : async ()=> {
        const res = await apiHelper.get('/saleman-notes/getallnotes')
        return  res.data;
    },
    getNotesById : async (id)=> {
        const res = await apiHelper.get('/saleman-notes/getnotes/'+id)
        return res.data;
    },
    addNotes: (payload) => apiHelper.post('/saleman-notes/addnotes',payload),
    editNotes: (payload) =>{
        console.log("payload",payload)
        apiHelper.post('/saleman-notes/updatenotes/'+payload._id,payload)},
    deleteNotes: async(id) =>{ 
        const res  = await  apiHelper.delete('/saleman-notes/deletenotes/'+id)
        return res
    }
}

export default salesmanServices;