const manualLog = require('./manuallogger'); 
const cloudinary = require('./cloudinary');
const fs = require('fs');

const cloudinary_upload = async(local_path,tenent_username,customFileName)=>{
    // console.log('localpath',local_path)
    // console.log('distributer name',tenent_username)
    try {
        const folder = `tenent_products/${tenent_username}`;

        const result = await cloudinary.uploader.upload(local_path,{folder,public_id:customFileName});
        fs.unlinkSync(local_path);
        // console.log(`try to delete ${local_path}`);
        const imgurl = {
            url:result.secure_url,
            public_id: result.public_id
        } 
        return imgurl;
    } catch (error) {
        manualLog(`there is error in cloudinary upload ::  ${JSON.stringify(error)}`);
        console.log("there is error in clodinary upload img");      
    }
}

module.exports = cloudinary_upload