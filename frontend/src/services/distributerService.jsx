import apiHelper from '../utils/Url'


const distributerServices = {
    //about the salesman apis
    AddSalesman : (payload) =>apiHelper.post('/salesman/addsalesman',payload)
}

export default distributerServices;