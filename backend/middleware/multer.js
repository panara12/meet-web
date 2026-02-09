const multer = require('multer');
const path = require('path');
const fs = require('fs');

//create folder if not present
const uploadPath = path.join(__dirname, '..','public', 'tempUploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath,{ recursive: true });
}

//allowed img types
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp','application/pdf'];

const fileFilter = (req,file,cb)=>{
    console.log("file type",file.mimetype);
     if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Only JPG, JPEG, PNG, and WEBP formats are allowed');
        error.code = 'LIMIT_FILE_TYPE';
        cb(error, false);
    }
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadPath)
    },
    filename:(req,file,cb)=>{
       console.log("original name",file);
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 3MB
    },
    fileFilter,
});

// Custom error handling middleware for multer
const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size should not exceed 3MB' });
    }
    if (err.code === 'LIMIT_FILE_TYPE') {
      return res.status(400).json({ error: 'Only JPG, JPEG, PNG, and WEBP files are allowed' });
    }
    return res.status(500).json({ error: 'File upload error', details: err, reqdata: req.files });
  }
  next();
};

module.exports = {upload,multerErrorHandler};