const express = require('express');
const manualLog = require('../utils/manuallogger');
const user_session_checker = require('../middleware/user_session');
const { uploadFileToDO } = require("../utils/digitalocean");
const { upload, multerErrorHandler } = require('../middleware/multer');
const mongoose = require('mongoose');

const router = express.Router();

// ------------------- ADD FILE -------------------
router.post(
  '/addfile',
  user_session_checker('add_file'),
  upload.array('files'), // Allow up to 10 files
  multerErrorHandler,
  async (req, res) => {
    manualLog('entered add file route');
    console.log('file data', req.files);
    console.log('req body data', req.body);
    
    try {
      const { file_day, file_description, uploaded_by, uploaded_for } = req.body;

      // Validate required fields
      if (!file_day) {
        return res.status(400).json({
          message: 'File day is required',
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: 'At least one file is required',
        });
      }

      const tenent_username = req.tenent.D_dbname;
      const folderPath = `${tenent_username}/files`;

      // Upload files to DigitalOcean
      const uploadPromises = req.files.map(async (file) => {
        const fileUrl = await uploadFileToDO(file.path, folderPath, file.mimetype);
        console.log("File uploaded to DO:", fileUrl);
        
        return {
          file_name: file.originalname,
          file_url: fileUrl,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      console.log("All files uploaded:", uploadedFiles);

      // Get File model
      const File = req.db.model('File');

      // Create file documents
      const fileDocuments = uploadedFiles.map(file => ({
        file_name: file.file_name,
        file_url: file.file_url,
        file_day: file_day,
        file_description: file_description || null,
        uploaded_by: uploaded_by ? new mongoose.Types.ObjectId(uploaded_by || req.session.user.tenant_user_id) : null,
        uploaded_for: uploaded_for ? new mongoose.Types.ObjectId(uploaded_for) : null,
      }));

      // Insert all files
      const savedFiles = await File.create(fileDocuments);

      manualLog(
        `${savedFiles.length} file(s) added by user: ${req.session.user.username}`
      );

      res.status(200).json({
        message: 'Files uploaded successfully',
        files: savedFiles,
        count: savedFiles.length,
      });

    } catch (error) {
      console.log('Error in add file:', error);
      console.log('Error stack:', error.stack);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation error',
          errors: messages,
        });
      }

      manualLog(`Error in add file :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'There was an error uploading the file',
        error: error.message,
      });
    }
  }
);

// ------------------- UPDATE FILE -------------------
router.post(
  '/updatefile/:id',
  user_session_checker('edit_file'),
  upload.single('file'),
  multerErrorHandler,
  async (req, res) => {
    manualLog('entered update file route');
    
    try {
      const { id } = req.params;
      const { file_day, file_description, uploaded_by, uploaded_for } = req.body;

      const File = req.db.model('File');
      const fileData = await File.findById(id);
      
      if (!fileData) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Prepare update object
      const updateData = {};
      
      if (file_day) updateData.file_day = file_day;
      if (file_description !== undefined) updateData.file_description = file_description;
      if (uploaded_by) updateData.uploaded_by = new mongoose.Types.ObjectId(uploaded_by);
      if (uploaded_for) updateData.uploaded_for = new mongoose.Types.ObjectId(uploaded_for);

      // If new file is uploaded, replace the old one
      if (req.file) {
        const tenent_username = req.tenent.D_dbname;
        const folderPath = `${tenent_username}/files`;

        const newFileUrl = await uploadFileToDO(
          req.file.path,
          folderPath,
          req.file.mimetype
        );

        updateData.file_url = newFileUrl;
        updateData.file_name = req.file.originalname;

        console.log("New file uploaded:", newFileUrl);
      }

      // Update the file
      const updatedFile = await File.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('uploaded_by uploaded_for', 'name email');

      manualLog(`File updated: ${updatedFile._id}`);
      
      res.status(200).json({
        message: 'File updated successfully',
        file: updatedFile,
      });

    } catch (error) {
      console.log('Error in update file:', error);
      manualLog(`Error in update file :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'There was an error updating the file',
        error: error.message,
      });
    }
  }
);

// ------------------- GET FILE BY ID -------------------
router.get(
  '/getfile/:id',
  user_session_checker('get_by_id_file'),
  async (req, res) => {
    manualLog('entered get file by id route');
    
    try {
      const { id } = req.params;
      const File = req.db.model('File');
      
      const fileData = await File.findById(id)
        .populate('uploaded_by', 'distributer_name distributer_email')
        .populate('uploaded_for', 'firstName email');
      
      if (!fileData) {
        return res.status(404).json({ message: 'File not found' });
      }

      manualLog(`Retrieved file by id: ${fileData._id}`);
      
      res.status(200).json({
        message: 'File retrieved successfully',
        file: fileData,
      });

    } catch (error) {
      console.log('Error in get file by id:', error);
      manualLog(`Error in get file by id :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Error retrieving file',
        error: error.message,
      });
    }
  }
);

// ------------------- GET FILES BY DAY -------------------
router.get(
  '/getfilesbyDay/:day',
  user_session_checker('get_file'),
  async (req, res) => {
    manualLog('entered get files by day route');
    
    try {
      const { day } = req.params;
      const File = req.db.model('File');
      
      const files = await File.find({ file_day: day })
        .populate('uploaded_by', 'name email')
        .populate('uploaded_for', 'name email')
        .sort({ uploaded_at: -1 });

      manualLog(`Retrieved ${files.length} files for day: ${day}`);
      
      res.status(200).json({
        message: 'Files retrieved successfully',
        day: day,
        count: files.length,
        files: files,
      });

    } catch (error) {
      console.log('Error in get files by day:', error);
      manualLog(`Error in get files by day :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Error retrieving files by day',
        error: error.message,
      });
    }
  }
);

// ------------------- GET ALL FILES WITH FILTERS & PAGINATION -------------------
router.get(
  '/getfilesbystaff/:staffId',
  user_session_checker('get_all_file_staff'),
  async (req, res) => {
    manualLog('entered get staff all files route');
    
    try {

      const File = req.db.model('File');

      // Execute query
      const files = await File.find({ uploaded_for: req.params.staffId })
        .populate('uploaded_by', 'distributer_name distributer_email')
        .populate('uploaded_for', 'firstName email')
        .sort({ uploaded_at: -1 });

      manualLog(`Retrieved ${files.length} files`);

      res.status(200).json({
        message: 'Files retrieved successfully',
        files: files,
      });

    } catch (error) {
      console.error('Error in get all files:', error);
      manualLog(`Error in get all files :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Error retrieving files',
        error: error.message,
      });
    }
  }
);

router.get(
  '/getfilesbyweek',
  user_session_checker('get_file_week_by'),
  async (req, res) => {
    manualLog('entered get files by current week route');
    
    try {
      const File = req.db.model('File');
      
      // Get user ID from session
      const userId = req.session.user?.tenant_user_id;
      
      if (!userId) {
        return res.status(401).json({
          message: 'User not authenticated',
        });
      }
      
      // Get current date
      const today = new Date();
      
      // Calculate the start of the current week (Sunday)
      const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - currentDay);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Calculate the end of the current week (Saturday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      console.log('📅 Week Range:', {
        startOfWeek: startOfWeek.toISOString(),
        endOfWeek: endOfWeek.toISOString(),
        currentDay: currentDay,
        today: today.toISOString(),
        userId: userId
      });

      // Find files uploaded for this user within the current week
      const files = await File.find({
        uploaded_for: new mongoose.Types.ObjectId(userId),
        uploaded_at: {
          $gte: startOfWeek,
          $lte: endOfWeek
        }
      })
        .populate('uploaded_by', 'distributer_name distributer_email')
        .populate('uploaded_for', 'firstName email')
        .sort({ uploaded_at: -1 });

      manualLog(`Retrieved ${files.length} files for user ${userId} for current week`);
      
      res.status(200).json({
        message: 'Files retrieved successfully',
        weekRange: {
          start: startOfWeek,
          end: endOfWeek,
          weekNumber: Math.ceil((today - new Date(today.getFullYear(), 0, 1)) / 604800000)
        },
        count: files.length,
        files: files,
      });

    } catch (error) {
      console.log('Error in get files by week:', error);
      manualLog(`Error in get files by week :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Error retrieving files by week',
        error: error.message,
      });
    }
  }
);

// ------------------- DELETE FILE -------------------
router.delete(
  '/deletefile/:id',
  user_session_checker('delete_file'),
  async (req, res) => {
    manualLog('entered delete file route');
    
    try {
      const { id } = req.params;
      const File = req.db.model('File');
      
      const deletedFile = await File.findByIdAndDelete(id);
      
      if (!deletedFile) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Optional: Delete file from DigitalOcean if you have a delete function
      // await deleteFileFromDO(deletedFile.file_url);

      manualLog(`File deleted: ${deletedFile._id}`);
      
      res.status(200).json({
        message: 'File deleted successfully',
        file: deletedFile,
      });

    } catch (error) {
      console.log('Error in delete file:', error);
      manualLog(`Error in delete file :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Error deleting file',
        error: error.message,
      });
    }
  }
);

// ------------------- DELETE FILES BY USER -------------------
router.delete(
  '/deletefilesbyuser/:userId',
  user_session_checker('delete_file'),
  async (req, res) => {
    manualLog('entered delete files by user route');
    
    try {
      const { userId } = req.params;
      const File = req.db.model('File');

      // Find all files uploaded by or for this user
      const files = await File.find({
        $or: [
          { uploaded_by: userId },
          { uploaded_for: userId }
        ]
      });

      if (!files || files.length === 0) {
        return res.status(404).json({ message: 'No files found for this user' });
      }

      // Delete files from database
      const deleteResult = await File.deleteMany({
        $or: [
          { uploaded_by: userId },
          { uploaded_for: userId }
        ]
      });

      // Optional: Delete files from DigitalOcean
      // for (const file of files) {
      //   await deleteFileFromDO(file.file_url);
      // }

      manualLog(`Deleted ${deleteResult.deletedCount} files for user: ${userId}`);
      
      res.status(200).json({
        message: `All files for user ${userId} deleted`,
        deletedCount: deleteResult.deletedCount,
      });

    } catch (error) {
      console.log('Error in delete files by user:', error);
      manualLog(`Error in delete files by user :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Error deleting files by user',
        error: error.message,
      });
    }
  }
);

// ------------------- GET FILE COUNT BY USER -------------------
router.get(
  '/filecount/:userId',
  user_session_checker('get_file'),
  async (req, res) => {
    manualLog('entered file count route');
    
    try {
      const { userId } = req.params;
      const File = req.db.model('File');

      const uploadedByCount = await File.countDocuments({ uploaded_by: userId });
      const uploadedForCount = await File.countDocuments({ uploaded_for: userId });
      const totalCount = await File.countDocuments({
        $or: [
          { uploaded_by: userId },
          { uploaded_for: userId }
        ]
      });

      res.status(200).json({
        message: 'File count retrieved successfully',
        userId: userId,
        uploadedByCount: uploadedByCount,
        uploadedForCount: uploadedForCount,
        totalCount: totalCount,
      });

    } catch (error) {
      console.log('Error in file count:', error);
      manualLog(`Error in file count :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Error retrieving file count',
        error: error.message,
      });
    }
  }
);

// ------------------- GET FILES BY DATE RANGE -------------------
router.get(
  '/getfilesbydaterange',
  user_session_checker('get_file'),
  async (req, res) => {
    manualLog('entered get files by date range route');
    
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          message: 'Start date and end date are required',
        });
      }

      const File = req.db.model('File');
      
      const files = await File.find({
        uploaded_at: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
        .populate('uploaded_by', 'name email')
        .populate('uploaded_for', 'name email')
        .sort({ uploaded_at: -1 });

      manualLog(`Retrieved ${files.length} files between ${startDate} and ${endDate}`);
      
      res.status(200).json({
        message: 'Files retrieved successfully',
        startDate: startDate,
        endDate: endDate,
        count: files.length,
        files: files,
      });

    } catch (error) {
      console.log('Error in get files by date range:', error);
      manualLog(`Error in get files by date range :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'Error retrieving files by date range',
        error: error.message,
      });
    }
  }
);

module.exports = router;