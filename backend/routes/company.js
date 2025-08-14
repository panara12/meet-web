const express = require('express');
const manualLog = require('../utils/manuallogger');
const distributer_session_checker = require('../middleware/distributer_session');
const router = express.Router();

router.post('/addcompany',distributer_session_checker,async(req,res)=>{
    try {
        console.log(req.body);
        const {company_list} = req.body;
        const Company = req.db.model('Company')
        const company_data = await Company.insertMany(company_list)
        res.status(200).json({
            message:"company added sussecfully",
            company : company_data 
        })
    } catch (error) {
        console.log("there is some error in comapny add route");
        manualLog(`error in comapnny add ::${error}`)  
        res.status(500).json({message:"error in add company"})  
    }
})

router.post('/updatecompany/:id',distributer_session_checker,async(req,res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const Company = req.db.model('Company')
        const company_data = await Company.findOneAndUpdate({_id:id},{$set:req.body},{new:true})
        res.status(200).json({
            message:"company updated sussecfully",
            company : company_data 
        })
    } catch (error) {
        console.log("there is some error in comapny update route");
        manualLog(`error in comapnny update ::${error}`)    
        res.status(500).json({message:"error in update company"})
    }
})

router.get('/getallcompany',distributer_session_checker,async (req,res)=>{
    try {
        const Company = req.db.model('Company')
        const company_data = await Company.find();
        res.status(200).json({
            message:"get all company sussecfully",
            company : company_data 
        })
        
    } catch (error) {
        console.log("there is some error in comapny delete route");
        manualLog(`error in comapnny delete ::${error}`)    
        res.status(500).json({message:"error in getall company"})
    }
})

router.delete('/deletecompany/:id',distributer_session_checker,async(req,res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const Company = req.db.model('Company')
        const company_data = await Company.findOneAndDelete({_id:id})
        res.status(200).json({
            message:"company deleted sussecfully",
            company : company_data 
        })
    } catch (error) {
        console.log("there is some error in comapny delete route");
        manualLog(`error in comapnny delete ::${error}`)   
        res.status(500).json({message:"error in delete company"}) 
    }
})

module.exports = router