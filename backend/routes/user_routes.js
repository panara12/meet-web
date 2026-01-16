const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const tenent_checker = require('../middleware/tenent_middleware');
const manualLog = require('../utils/manuallogger');
const Tenent_user_master = require('../models/tenent_user_model');
const user_session_checker = require('../middleware/user_session');
const { uploadFileToDO } = require("../utils/digitalocean");
const {upload ,multerErrorHandler} = require('../middleware/multer');
const path = require('path');
router.use(tenent_checker);

// ADD NEW USER
router.post('/adduser', user_session_checker('add_user'), upload.fields([
    { name: 'aadhar', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'driving', maxCount: 1 },
  ]), async (req, res) => {
  manualLog('entered in add new user route');
  try {
    const { firstName, lastName, email, phone, address, role, department, hireDate, salary, username, password, workHours, permissions, emergencyContact, notes, aadhaarNumber, panNumber, drivingLicenseNumber, accountHolderName, bankAccountNumber, bankName, ifscCode, bankBranch } = req.body;
    const tenent_username = req.tenent.D_dbname;
    let imageDocs = []
    const folderPath = `${tenent_username}/${firstName}-${lastName}`;
    console.log('file data',req.files);
    console.log('req body data',req.body);

    //file upload to the digital ocean 
    if (req.files && Object.keys(req.files).length > 0) {
      // Files are present, proceed with upload
      const res_DO = await Promise.all(Object.entries(req.files).map(async ([key, fileArr]) => {
          const file = fileArr[0];
          const response = await uploadFileToDO(file.path, folderPath,file.mimetype);
          console.log("route response file upload", response);
          return { name: key, url: response };
        }));

        console.log("digital ocean response", res_DO);
        imageDocs = res_DO.map(file => ({
          url: file.url,
          doc_name: file.name // Default name, can be modified as needed
        }));
        console.log("imageDocs", imageDocs);
    }

    // Validation
    if (!firstName || !lastName || !email || !password || !phone || !username || !role || !department) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const User = req.db.model('User');

    // Generate Employee ID
    const employeeId = `EMP-${Date.now()}`;

    // Create new user
    const new_user = new User({
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      address,
      role,
      department,
      hireDate: hireDate || new Date(),
      salary: salary || 0,
      username,
      password: hashedPassword,
      documents: imageDocs,
      workHours: workHours || 'Full-time',
      status: 'Active',
      permissions: permissions || ['sales_access'],
      emergencyContact: emergencyContact,
      notes,
      aadhaarNumber,
      panNumber,
      drivingLicenseNumber,
      accountHolderName,
      bankAccountNumber,
      bankName,
      ifscCode,
      bankBranch
    });

    await new_user.save();

    // Create tenant user record
    await Tenent_user_master.create({
      user_email: email,
      tenant_user_id: new_user._id,
      user_password: hashedPassword,
      user_mobile: phone,
      user_username: username,
      user_tenant: req.session.user.tenant,
      user_role: role
    });

    manualLog(`${role} registered successfully :: ${new_user._id}`);
    res.status(200).json({
      message: 'User added successfully',
      user: new_user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const error_message = Object.values(error.errors).map(err => err.message);
      manualLog(`Validation error in user registration :: ${error_message}`);
      res.status(400).json({ message: error_message });
    } else {
      console.log('Failed to add new user', error);
      manualLog('Error in user registration');
      res.status(500).json({ message: 'Failed to add user', error: error.message });
    }
  }
});

// UPDATE USER
router.post('/updateuser/:id', user_session_checker('edit_user'), async (req, res) => {
  manualLog('entered in update user route');
  try {
    const { id } = req.params;
    const req_user_data = req.body;

    const User = req.db.model('User');
    const user_data = await User.findById(id);

    if (!user_data) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle document updates
    if (req_user_data.documents || req.files.length > 0) {
      const updatedPublicIds = Array.isArray(req_user_data.documents)
        ? req_user_data.documents
        : req_user_data.documents ? [req_user_data.documents] : [];
      
      const folderPath = `${tenent_username}/products`;
      console.log('file data',req.files);

      // Retain existing documents
        const retainedDocuments = user_data.documents.filter(
          doc => updatedPublicIds.includes(doc.url)
        );

      //file upload to the digital ocean 
      const res_DO = 
        await Promise.all(Object.entries(req.files).map(async ([key, fileArr]) => {
          const file = fileArr[0];
          const response = await uploadFileToDO(file.path, folderPath,file.mimetype);
          console.log("route response file upload", response);
          return { name: key, url: response };
        }));

      console.log("digital ocean response", res_DO);
      const imageDocs = res_DO.map(file => ({
        url: file.url,
        doc_name: file.name // Default name, can be modified as needed
      }));
      console.log("imageDocs", imageDocs);
      
      req_user_data.documents = [...retainedDocuments, ...imageDocs];

    }

    // Parse JSON fields if provided as strings
    if (req_user_data.emergencyContact && typeof req_user_data.emergencyContact === 'string') {
      req_user_data.emergencyContact = JSON.parse(req_user_data.emergencyContact);
    }

    if (req_user_data.permissions && typeof req_user_data.permissions === 'string') {
      req_user_data.permissions = JSON.parse(req_user_data.permissions);
    }

    // Hash password if provided
    if (req_user_data.password) {
      const saltRounds = 10;
      req_user_data.password = await bcrypt.hash(req_user_data.password, saltRounds);
    }

    // Update user
    const updated_user = await User.findOneAndUpdate(
      { _id: id },
      { $set: req_user_data },
      { new: true, runValidators: true }
    );

    manualLog(`User updated successfully :: ${updated_user._id}`);
    res.status(200).json({
      message: 'User updated successfully',
      user: updated_user
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const error_message = Object.values(error.errors).map(err => err.message);
      manualLog(`Validation error in user update :: ${error_message}`);
      res.status(400).json({ message: error_message });
    } else {
      console.log('Failed to update user', error);
      manualLog('Error in user update');
      res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
  }
});

// GET ALL USERS
router.get('/getalluser', user_session_checker('get_all_user'), async (req, res) => {
  manualLog('entered in get all user route');
  try {
    const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status;
        const department = req.query.department;
        const role = req.query.role;
        const sortField = req.query.sortField || 'name';
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;

        const filter = {};
        
        // Search filter (search in multiple fields)
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } }
            ];
        }
        // Status filter
        if (status) {
            filter.status = status;
        }

        // Department filter
        if (department) {
            filter.department = department;
        }
        if (role) {
            filter.role = role;
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort = {};
        sort[sortField] = sortDirection;

        // Get total count for pagination
        const User = req.db.model('User');
        const totalRecords = await User.countDocuments({isDeleted: false,...filter});
        const totalPages = Math.ceil(totalRecords / limit);


    const user_data = await User.find({ isDeleted: false, ...filter }).skip(skip).limit(limit).sort(sort);
    manualLog('All users fetched successfully');
    res.status(200).json({
      message: 'All users retrieved',
      user: {
        data:user_data,
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
    console.log('Failed to fetch users', error);
    manualLog(`Error in get all users :: ${JSON.stringify(error)}`);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});


// GET USER BY ID
router.get('/getuser/:id', user_session_checker('get_by_id_user'), async (req, res) => {
  manualLog('entered in get user by id route');
  try {
    const { id } = req.params;
    const User = req.db.model('User');
    const user_data = await User.findOne({ _id: id, isDeleted: false });

    if (!user_data) {
      return res.status(404).json({ message: 'User not found' });
    }

    manualLog(`User retrieved by id successfully :: ${user_data._id}`);
    res.status(200).json({
      message: 'User retrieved',
      user: user_data
    });
  } catch (error) {
    console.log('Failed to fetch user', error);
    manualLog(`Error in get user by id :: ${JSON.stringify(error)}`);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

// GET USER BY ROLE
router.post('/getbyuserrole', user_session_checker('user_by_userrole'), async (req, res) => {
  manualLog('entered in get user by role route');
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const User = req.db.model('User');
    const user_data = await User.find({ role: role, isDeleted: false });

    if (user_data.length === 0) {
      return res.status(200).json({
        message: 'No users found for this role',
        user: []
      });
    }

    manualLog(`Users fetched by role successfully :: ${user_data.length} users`);
    res.status(200).json({
      message: 'Users retrieved by role',
      user: user_data
    });
  } catch (error) {
    console.log('Failed to fetch users by role', error);
    manualLog(`Error in get users by role :: ${JSON.stringify(error)}`);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// DELETE USER (Soft Delete)
router.delete('/deleteuser/:id', user_session_checker('delete_user'), async (req, res) => {
  manualLog('entered in delete user route');
  try {
    const { id } = req.params;
    const User = req.db.model('User');

    const user_data = await User.findOneAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true }
    );

    if (!user_data) {
      return res.status(404).json({ message: 'User not found' });
    }

    manualLog(`User deleted successfully :: ${user_data._id}`);
    res.status(200).json({
      message: 'User deleted successfully',
      user: user_data
    });
  } catch (error) {
    console.log('Failed to delete user', error);
    manualLog(`Error in delete user :: ${JSON.stringify(error)}`);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

module.exports = router;