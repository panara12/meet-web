// utils/doUploader.js
const { S3Client,PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const { Upload } = require("@aws-sdk/lib-storage");
require("dotenv").config();
const uuid = require("uuid").v4;
const fs = require("fs");

// Configure DigitalOcean Spaces (S3-compatible)
const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION,
  endpoint: process.env.DO_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

// ✅ Function to upload one file directly (for programmatic uploads)
async function uploadFileToDO(filePath, folderName,mimetype = "application/octet-stream") {
  const fileName = `${uuid()}`;
  const key = `${folderName}/${fileName}`;

  const input = {
    ACL: 'public-read',
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: key,
    Body: fs.createReadStream(filePath),
    ContentType: mimetype,  
  };
  const command = new PutObjectCommand(input);
  const response = await s3.send(command);
  console.log("File uploaded successfully. ETag:", response);
  return key;
}



module.exports = { uploadFileToDO };
