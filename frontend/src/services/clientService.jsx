import apiHelper from '../utils/Url'


const clientServices = {
    getSellerList : async ()=> {
        const res = await apiHelper.get('/seller/allseller')
        return res.data;
    },
    getSellerById : async (payload)=> {
        const res = await apiHelper.get('/seller/getseller/'+payload.id)
        return res.data;
    },
    addSeller: (payload) => apiHelper.post('/seller/addseller',payload),
    updateSeller: async (payload) =>{ 
        console.log("update methos",payload);
        const res = await apiHelper.post('/seller/updateseller/'+payload.id,payload)
        console.log("response rdat",res)
        return res;
    },
    deleteSeller: async(payload) =>{ 
        const res  = await  apiHelper.delete('/seller/deleteseller/'+payload.id)
        return res.data;
    }


}

export default clientServices;