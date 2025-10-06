const express = require('express');
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const router = express.Router();

// Add Company
router.post('/addcompany', user_session_checker("add_company"), async (req, res) => {
    try {
        const company_data  = req.body;
        console.log(company_data);
        const Company = req.db.model('Company');
        if (!company_data.name || !company_data.address || !company_data.phone) {
            return res.status(400).json({ message: "name, address, and phone are required" });
        }

        const new_company_data = await Company.create(company_data);
        res.status(200).send({
            message: "company added successfully",
            company: new_company_data
        });
    } catch (error) {
        console.log("there is some error in company add route");
        manualLog(`error in company add :: ${error}`);
        res.status(500).json({ message: "error in add company" });
    }
});

// Update Company
router.post('/updatecompany/:id', user_session_checker("edit_company"), async (req, res) => {
    try {
        console.log(req.body);
        const { id } = req.params;
        const Company = req.db.model('Company');

        const company_data = await Company.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({
            message: "company updated successfully",
            company: company_data
        });
    } catch (error) {
        console.log("there is some error in company update route");
        manualLog(`error in company update :: ${error}`);
        res.status(500).json({ message: "error in update company" });
    }
});

// Get All Companies
router.get('/getallcompany', user_session_checker("get_all_company"), async (req, res) => {
    try {
        const Company = req.db.model('Company');
        const company_data = await Company.find();
        res.status(200).json({
            message: "get all company successfully",
            company: company_data
        });

    } catch (error) {
        console.log("there is some error in company get route");
        manualLog(`error in company getall :: ${error}`);
        res.status(500).json({ message: "error in getall company" });
    }
});

router.get('/getcompany/:id', user_session_checker("get_company"), async (req, res) => {
    try {
        const { id } = req.params;
        const Company = req.db.model('Company');
        const company_data = await Company.findById(id);

        if (!company_data) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({
            message: "get company by id successfully",
            company: company_data
        });
    } catch (error) {
        console.log("there is some error in company get by id route");
        manualLog(`error in company getbyid :: ${error}`);
        res.status(500).json({ message: "error in get company by id" });
    }
});

// Delete Company
router.delete('/deletecompany/:id', user_session_checker("delete_company"), async (req, res) => {
    try {
        console.log(req.body);
        const { id } = req.params;
        const Company = req.db.model('Company');
        const company_data = await Company.findOneAndDelete({ _id: id });
        res.status(200).json({
            message: "company deleted successfully",
            company: company_data
        });
    } catch (error) {
        console.log("there is some error in company delete route");
        manualLog(`error in company delete :: ${error}`);
        res.status(500).json({ message: "error in delete company" });
    }
});

module.exports = router;
