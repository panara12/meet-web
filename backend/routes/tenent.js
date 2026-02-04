const express = require('express');
const Tenent = require('../models/tenent_model');
const Tenent_user_master = require('../models/tenent_user_model'); // Import the user master model
const bcrypt = require('bcrypt');
const manualLog = require('../utils/manuallogger');
const getTenentList = require('../utils/tenentgeter');
const gettenentDb = require('../tenent'); // DB switcher
const router = express.Router();
const tenentCache = require('../cache/tenent_list'); 

/**
 * Helper function to initialize tenant database with all required collections
 * @param {Object} tenantDbConnection - Mongoose connection to tenant DB
 * @param {Object} distributerData - Distributor information
 * @param {Object} limitsData - Limits configuration
 * @param {String} hashedPassword - Hashed password for user
 * @returns {Object} Created documents
 */
async function initializeTenantDb(tenantDbConnection, distributerData, limitsData, hashedPassword) {
    try {
        // Get all models from tenant DB connection
        const Distributer = tenantDbConnection.model("Distributer");
        const User = tenantDbConnection.model("User");
        const Limits = tenantDbConnection.model("Limits");
        const subadmin = tenantDbConnection.model("Subadmin");

        // Create Distributer document
        const newDistributer = new Distributer({
            distributer_name: distributerData.distributer_name,
            distributer_mobile: distributerData.distributer_mobile,
            distributer_email: distributerData.distributer_email,
            distributer_firms: distributerData.distributer_firms || [],
            distributer_city: distributerData.distributer_city,
            distributer_username: distributerData.distributer_username,
            user_tenant: distributerData.user_tenant, // Auto-filled from D_domain
            user_role: "admin" // First distributor is always admin
        });
        await newDistributer.save();

        const newSubadmin = new subadmin({
            name: distributerData.distributer_name,
            username: distributerData.distributer_username,
            password: hashedPassword
        });
        await newSubadmin.save();

        // Create User document (admin user for the distributor)
        const newUser = await User.create({
            employeeId: "dist-001", // Hardcoded for first distributor
            firstName: distributerData.distributer_name,
            email: distributerData.distributer_email,
            phone: distributerData.distributer_mobile,
            address: distributerData.distributer_city,
            role: "admin",
            department: "admin",
            username: distributerData.distributer_username,
            password: hashedPassword
        });

        // Create Limits document with provided or default values
        const newLimits = await Limits.create({
            adminlimit: limitsData.adminlimit || 1,
            salesmanlimit: limitsData.salesmanlimit || 2,
            packagelimit: limitsData.packagelimit || 1,
            billinglimit: limitsData.billinglimit || 1,
            liveLocationlimit: limitsData.liveLocationlimit || 35,
            totalLiveLocationlimit: limitsData.totalLiveLocationlimit || 35,
            routeLocationlimit: limitsData.routeLocationlimit || 35,
            totalRouteLocationlimit: limitsData.totalRouteLocationlimit || 35,
            wantToUsePhotos:limitsData.wantToUsePhotos,
            isAdminMembers:limitsData.isAdminMembers,
            wantToUsePayment:limitsData.wantToUsePayment,
            wantToUseLocation:limitsData.wantToUseLocation,
            placedOrderCount:0
        });

        manualLog(`✅ Tenant DB initialized successfully with Distributer: ${newDistributer._id}, User: ${newUser._id}, Limits: ${newLimits._id}`);

        return {
            distributer: newDistributer,
            user: newUser,
            limits: newLimits
        };

    } catch (error) {
        manualLog(`❌ Error initializing tenant DB: ${JSON.stringify(error)}`);
        throw error;
    }
}

/**
 * POST /addtenent
 * Registers a new tenant with automatic first distributor creation
 * Creates tenant-specific database and all required collections
 */
router.post('/addtenant', async (req, res) => {
    manualLog(`🚀 Entered tenant registration route :: ${req.body.D_name}`);
    
    try {
        // ========== STEP 1: Extract and validate tenant data ==========
        const {
            // Tenant fields
            D_name,
            D_domain,
            D_plan,
            D_payment,
            D_dbname,
            
            // Distributor fields
            distributer_name,
            distributer_mobile,
            distributer_email,
            distributer_password,
            distributer_firms,
            distributer_city,
            distributer_username,
            
            // Limits fields (optional with defaults)
            adminlimit,
            salesmanlimit,
            packagelimit,
            billinglimit,
            liveLocationlimit,
            totalLiveLocationlimit,
            routeLocationlimit,
            totalRouteLocationlimit,
            wantToUsePhotos,
            isAdminMembers,
            wantToUsePayment,
            wantToUseLocation
        } = req.body;

        console.log("📝 Tenant Registration Data:", { D_name, D_domain, D_dbname });
        console.log("📝 Distributor Registration Data:", { distributer_name, distributer_email });

        // ========== STEP 2: Hash the password ==========
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(distributer_password, saltRounds);
        manualLog(`🔒 Password hashed successfully for: ${distributer_email}`);

        // ========== STEP 3: Create tenant in common DB (tenant_master) ==========
        const newTenant = new Tenent({
            D_name,
            D_domain,
            D_plan,
            D_payment,
            D_dbname
        });
        await newTenant.save();
        manualLog(`✅ Tenant saved to tenant_master :: ${newTenant._id} = ${newTenant.D_name}`);

        // ========== STEP 4: Create/Get tenant-specific DB connection ==========
        const tenantDbConnection = await gettenentDb(D_dbname);
        
        if (!tenantDbConnection) {
            throw new Error(`Failed to create connection for tenant DB: ${D_dbname}`);
        }
         if (tenantDbConnection.readyState !== 1) {
            await new Promise((resolve, reject) => {
                tenantDbConnection.once('connected', resolve);
                tenantDbConnection.once('error', reject);
                
                // Timeout after 10 seconds
                setTimeout(() => reject(new Error('Connection timeout')), 10000);
            });
        }

        manualLog(`✅ Tenant DB connection established: ${D_dbname}`);

        // ========== STEP 5: Initialize tenant DB with all collections ==========
        const distributerData = {
            distributer_name,
            distributer_mobile,
            distributer_email,
            distributer_firms,
            distributer_city,
            distributer_username,
            user_tenant: D_domain // Auto-fill from tenant domain
        };

        const limitsData = {
            adminlimit,
            salesmanlimit,
            packagelimit,
            billinglimit,
            liveLocationlimit,
            totalLiveLocationlimit,
            routeLocationlimit,
            totalRouteLocationlimit,
            wantToUsePhotos,
            isAdminMembers,
            wantToUsePayment,
            wantToUseLocation
        };

        const { distributer: newDistributer, user: newUser, limits: newLimits } = 
            await initializeTenantDb(tenantDbConnection, distributerData, limitsData, hashedPassword);

        // ========== STEP 6: Create entry in Tenent_user_master (common DB) ==========
        await Tenent_user_master.create({
            user_email: distributer_email,
            tenant_user_id: newDistributer._id.toString(),
            user_username: distributer_username,
            user_mobile: distributer_mobile,
            user_password: hashedPassword, // Only stored here (not in tenant DB User)
            user_role: "admin",
            user_tenant: D_domain
        });
        manualLog(`✅ User entry created in tenant_user_master for: ${distributer_email}`);

        // ========== STEP 7: Refresh tenant cache ==========
        const tenent_list = await getTenentList();
        tenentCache.tenent = tenent_list;
        manualLog(`✅ Tenant cache refreshed`,tenentCache);

        // ========== STEP 8: Return success response ==========
        res.status(200).json({
            message: "Tenant registered successfully with first distributor",
            tenant: {
                id: newTenant._id,
                name: newTenant.D_name,
                domain: newTenant.D_domain,
                dbname: newTenant.D_dbname
            },
            distributor: {
                id: newDistributer._id,
                name: newDistributer.distributer_name,
                email: newDistributer.distributer_email,
                username: newDistributer.distributer_username
            },
            database_initialized: true
        });

        manualLog(`🎉 Complete tenant registration successful :: Tenant: ${newTenant._id}, Distributor: ${newDistributer._id}`);

    } catch (error) {
        // ========== ERROR HANDLING WITH ROLLBACK ==========
        console.error("❌ Error occurred during tenant registration:", error);
        manualLog(`❌ Tenant registration failed, initiating rollback :: ${JSON.stringify(error.message)}`);

        // ========== ROLLBACK: Clean up all inserted records ==========
        try {
            const rollbackTasks = [];

            // 1. Delete tenant from tenant_master if it was created
            if (req.body.D_domain) {
                rollbackTasks.push(
                    Tenent.deleteOne({ D_domain: req.body.D_domain })
                        .then(() => manualLog(`🔄 Rollback: Deleted tenant from tenant_master`))
                        .catch(err => manualLog(`⚠️ Rollback warning: Could not delete tenant - ${err.message}`))
                );
            }

            // 2. Delete from tenant_user_master if distributer email exists
            if (req.body.distributer_email) {
                rollbackTasks.push(
                    Tenent_user_master.deleteOne({ user_email: req.body.distributer_email })
                        .then(() => manualLog(`🔄 Rollback: Deleted from tenant_user_master`))
                        .catch(err => manualLog(`⚠️ Rollback warning: Could not delete from tenant_user_master - ${err.message}`))
                );
            }

            // 3. Drop the entire tenant database if it was created
            if (req.body.D_dbname) {
                const tenantDbConnection = await gettenentDb(req.body.D_dbname).catch(() => null);
                
                if (tenantDbConnection) {
                    rollbackTasks.push(
                        tenantDbConnection.dropDatabase()
                            .then(() => {
                                manualLog(`🔄 Rollback: Dropped tenant database: ${req.body.D_dbname}`);
                                // Close the connection after dropping
                                tenantDbConnection.close();
                            })
                            .catch(err => manualLog(`⚠️ Rollback warning: Could not drop database - ${err.message}`))
                    );
                }
            }

            // Execute all rollback tasks
            await Promise.allSettled(rollbackTasks);
            manualLog(`✅ Rollback completed`);

            // Refresh tenant cache after rollback
            await getTenentList().catch(err => 
                manualLog(`⚠️ Could not refresh tenant cache after rollback - ${err.message}`)
            );

        } catch (rollbackError) {
            console.error("❌ Error during rollback:", rollbackError);
            manualLog(`❌ Rollback failed :: ${JSON.stringify(rollbackError.message)}`);
        }

        // ========== SEND ERROR RESPONSE ==========
        if (error.name === 'ValidationError') {
            const error_messages = Object.values(error.errors).map(err => err.message);
            manualLog(`❌ Tenant validation error :: ${error_messages.join(', ')}`);
            
            return res.status(400).json({
                message: "Validation failed - All changes have been rolled back",
                errors: error_messages
            });
        } 
        
        if (error.code === 11000) { // MongoDB duplicate key error
            const duplicateField = Object.keys(error.keyPattern)[0];
            manualLog(`❌ Duplicate entry error :: Field: ${duplicateField}`);
            
            return res.status(409).json({
                message: `Duplicate entry: ${duplicateField} already exists - All changes have been rolled back`,
                field: duplicateField
            });
        }
        
        // Generic error
        manualLog(`❌ Tenant registration failed :: ${JSON.stringify(error.message)}`);
        
        res.status(500).json({
            message: 'Tenant registration failed - All changes have been rolled back',
            error: error.message
        });
    }
});


router.get('/tenentdata/:id',async(req,res)=>{
    manualLog('entered in tenent by id route')
    try {
        const {id} = req.params
        const user_data = await Tenent.findOne({_id:id});
        console.log(user_data);
        manualLog(`get the tenent data by id ::${user_data._id}`)
        res.status(200).json({
            message:"got the Tenent data",
            Tenent:{user_data}
        })
    } catch (error) {
        console.log("Tenent data not getting error");
        manualLog(`there is error in tenent by id route :: ${JSON.stringify(error)}`)
        res.status(500).json({message:'somehow Tenent does not get'})  
    }
})

router.post('/tenentupdate/:id',async(req,res)=>{
        manualLog(`entered in tenentupdate route`)
    try {
        const {id} = req.params;
        const user_data = req.body;
        const updated_data =  await Tenent.findOneAndUpdate({_id:id},{$set: user_data},{new:true},{new:true});
        manualLog(`tenent updated seccussfully ::${updated_data._id}`)
        res.status(200).json({
            message:"the Tenent has been udated",
            Tenent:{updated_data}
        })
    } catch (error) {
        console.log("Tenent data is not updated");
        manualLog(`there is error in update tenent info :: ${JSON.stringify(error)}`)
        res.status(500).json({message:'Tenent data is not updated'})
    }
})

module.exports = router;