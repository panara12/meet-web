const express = require('express')
const bcrypt = require('bcrypt');
const user_session_checker = require('../middleware/user_session');
const Tenent_user_master = require("../models/tenent_user_model");
const router = express.Router()
const tenent_checker = require('../middleware/tenent_middleware');
const manualLog = require('../utils/manuallogger');

router.use(tenent_checker);

router.post('/addseller',user_session_checker("add_seller"),async(req,res)=>{
    manualLog('entered in add new seller route')
    try {
        const {name,email,phone,address,contactPerson,website,status,priority,industry,companySize,paymentTerms,gstNumber,creditLimit,tags,notes,userRole} = req.body
        //hash round and convert normal password to hasspassword
        const password = "youdon'tknow"
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const SellerModel = req.db.model("Seller");

        const new_seller = new SellerModel({
            name,
            email,
            phone,
            address,
            contactPerson,
            password: hashedPassword,
            website,
            status,
            priority,
            industry,
            companySize,
            paymentTerms,
            gstNumber,
            creditLimit,
            tags,
            notes,
            userRole,
            createdBy: req.session.user.master_user_id
        })
        await new_seller.save();
        await Tenent_user_master.create({
            user_email:email,
            tenant_user_id:new_seller._id,
            user_password:hashedPassword,
            user_username:phone,
            user_tenant:req.session.user.tenant,
            user_role:"seller"
        });
        manualLog(`seller registred successfully :: ${new_seller._id}`)
        res.status(200).json({
            message:"new seller added",
            seller:{new_seller}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            const validationErrors = Object.values(error.errors).map(err => err.message);
            console.log(error)
            manualLog(`there is a validation error in seller registration :: ${error}`)
            res.status(400).json({message:"something broke",error:validationErrors})
        }else{
        console.log('failed to add new seller')
        manualLog(`there is error in seller registration :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"new seller not added"})  
        }  
    }
})

router.post('/updateseller/:id',user_session_checker("edit_seller"),async(req,res)=>{
    manualLog('entered in update seller route')
    try {
        const {id} = req.params;
        const {name,email,phone,address,contactPerson,website,status,priority,industry,companySize,paymentTerms,gstNumber,creditLimit,tags,notes,userRole} = req.body;
        
        const user_data = {
            name,
            email,
            phone,
            address,
            contactPerson,
            website,
            status,
            priority,
            industry,
            companySize,
            paymentTerms,
            gstNumber,
            creditLimit,
            tags,
            notes,
            userRole,
            createdBy: req.session.user.master_user_id
        };

        const SellerModel = req.db.model("Seller");
        const updated_seller = await SellerModel.findOneAndUpdate({_id:id},{$set:user_data},{new:true})
        manualLog(`seller updated successfully :: ${updated_seller._id}`)
        res.status(200).json({
            message:"seller updated",
            seller:{updated_seller}
        })
    } catch (error) {
        if(error.name == 'ValidationError'){
            console.log(error)
            const error_message = Object.values(error.errors).map(err => err.message);
            manualLog(`there is a validation error in seller update :: ${error_message}`)
            res.status(400).json({message:error_message})
        }else{
            console.log('failed to update seller')
            manualLog(`there is error in update seller :: ${JSON.stringify(error)}`)
            res.status(500).json({message:"seller not updated"})    
        }
    }
})

router.get('/allseller', user_session_checker("get_all_seller"), async (req, res) => {
    try {
        const Seller = req.db.model('Seller'); // or 'Company' based on your model name
        
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status;
        const priority = req.query.priority;
        const sortField = req.query.sortField || 'name';
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;

        // Build filter object
        const filter = {};
        
        // Search filter (search in multiple fields)
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { contactPerson: { $regex: search, $options: 'i' } },
                { industry: { $regex: search, $options: 'i' } }
            ];
        }

        // Status filter
        if (status) {
            filter.status = status;
        }

        // Priority filter
        if (priority) {
            filter.priority = priority;
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort = {};
        sort[sortField] = sortDirection;

        // Get total count for pagination
        const totalRecords = await Seller.countDocuments(filter);
        const totalPages = Math.ceil(totalRecords / limit);

        // Fetch paginated and filtered data
        const seller_data = await Seller.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance

        res.status(200).json({
            message: "Get all sellers successfully",
            seller: {
                data: seller_data,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalRecords: totalRecords,
                    limit: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });
        
    } catch (error) {
        console.log("Error in seller getall route:", error);
        manualLog(`error in seller getall :: ${error}`);
        res.status(500).json({ 
            message: "Error in getall seller",
            error: error.message 
        });
    }
});

router.get('/getseller/:id',user_session_checker("get_by_id_seller"),async(req,res)=>{
    manualLog('entered in get seller by id route')
    try {
        const {id} = req.params;
        const SellerModel = req.db.model("Seller");
        const seller_data = await SellerModel.findOne({_id:id});
        manualLog(`get seller by id successfully :: ${seller_data._id}`)
        res.status(200).json({
            message:"",
            seller:{seller_data}
        })
    } catch (error) {
        console.log("seller data not found");
        manualLog(`there is error in get seller by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"seller data is not found"})
    }
})

router.delete('/deleteseller/:id',user_session_checker("delete_seller"),async(req,res)=>{
    manualLog('entered in delete seller route')
    try {
        const {id} = req.params;
        const SellerModel = req.db.model("Seller");
        const seller_data = await SellerModel.findOneAndDelete({_id:id});
        manualLog(`seller deleted successfully :: ${seller_data._id}`)
        res.status(200).json({
            message:"seller deleted",
            seller:{seller_data}
        })
    } catch (error) {
        console.log("seller data not deleted");
        manualLog(`there is error in delete seller by id :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"seller data is not deleted"})
    }
})
module.exports = router