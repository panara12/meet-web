const express = require('express')
const manualLog = require('../utils/manuallogger');
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const distributer_session = require('../middleware/distributer_session');
const cloudinary_upload = require('../utils/uploadWithCloudinary');
const {upload,multerErrorHandler} = require('../middleware/multer');
const cloudinary_delete = require('../utils/deleteWithCloudinary');

const router = express.Router();

router.post('/addproduct',distributer_session,upload.array('images',6),multerErrorHandler,async(req,res)=>{
    manualLog('entered add products route')
    try {
        const {product_name,product_company,product_size,product_color,product_type,product_stock,product_price,product_photos,product_firm} = req.body;
        const tenent_username = req.tenent.D_dbname;

        //get the size and color 
        const colors = Array.isArray(product_color) ? product_color : product_color.split(',');
        const sizes = Array.isArray(product_size) ? product_size : product_size.split(',');

        const uploadPromises = req.files.map(file => {
            const customFileName = `${Date.now()}-${path.parse(file.originalname).name}`;
            const local_path = path.join(file.destination, file.filename);
            return cloudinary_upload(local_path, tenent_username,customFileName);
        });
        const imageUrls = await Promise.all(uploadPromises);


        const Product = req.db.model("Product");
        // product_photos = imageUrls;
        // console.log(product_photos)

        const new_product = new Product({product_name,product_company,product_size:sizes,product_color:colors,product_type,product_stock,product_price,product_photos:imageUrls,product_firm})
        await new_product.save();

        manualLog(`new product added :: ${new_product._id}`)
        res.status(200).json({message:"new product added seccessfully",product:{new_product}});
    } catch (error) {
        console.log("there is error in add new products")
        manualLog(`there is error in add new products :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"there is error in add new products"})
    }
})


router.post('/updateproduct/:id',distributer_session,upload.array('images',6),multerErrorHandler,async(req,res)=>{
    manualLog("entered in update products")
    try {
        const { id } = req.params;
        const req_product_data = req.body;

        //fix the updated size and color 
        if (typeof req_product_data.product_color === "string") {
        product_color = req_product_data.product_color.split(',');
        } else if (!Array.isArray(product_color)) {
        product_color = [];
        }

        if (typeof req_product_data.product_size === "string") {
        product_size = req_product_data.product_size.split(',');
        } else if (!Array.isArray(product_size)) {
        product_size = [];
        }

        req_product_data.product_color = product_color;
        req_product_data.product_size = product_size;

        const Product = req.db.model("Product");
        const product_data = await Product.findById(id);
        if (!product_data) return res.status(404).json({ message: "Product not found" });

        const tenent_username = req.tenent.D_dbname;

        // Normalize product_photos from body
        const updatedPublicIds = Array.isArray(req_product_data.product_photos)
            ? req_product_data.product_photos
            : req_product_data.product_photos
                ? [req_product_data.product_photos]
                : [];

        // Find removed image public_ids
        const removedImgs = product_data.product_photos.filter(
            img => !updatedPublicIds.includes(img.public_id)
        );
        const removedPublicIds = removedImgs.map(img => img.public_id);

        // Delete them from Cloudinary in parallel
        await cloudinary_delete(removedPublicIds);

        // Retain images still present
        const retainedImages = product_data.product_photos.filter(
            img => updatedPublicIds.includes(img.public_id)
        );

        // Upload new files in parallel
        const uploadPromises = req.files.map(file => {
            const local_path = path.join(file.destination, file.filename); 
            const customFileName = `${Date.now()}-${path.parse(file.originalname).name}`;
            return cloudinary_upload(local_path, tenent_username,customFileName);
        });
        const newImages = await Promise.all(uploadPromises);

        // Merge retained + new
        req_product_data.product_photos = [...retainedImages, ...newImages];

        // Save product
        const updated_product = await Product.findByIdAndUpdate(
            { _id: id },
            { $set: req_product_data },
            { new: true }
        );

        manualLog(`Product updated: ${updated_product._id}`);
        res.status(200).json({
            message: "Product updated successfully",
            product: updated_product,
        });

    } catch (error) {
        console.log("Error in update products", error);
        manualLog(`Error in update products :: ${JSON.stringify(error)}`);
        res.status(500).json({ message: "There was an error updating the product" });
    }
})

router.get('/getproduct/:id',distributer_session,async(req,res)=>{
    manualLog('entered in get by id product')
    try {
        const {id} = req.params;
        const Product = req.db.model('Product');
        const product_data = await Product.findById(id);
        manualLog(`get the prodcut by id :: ${product_data._id}`)
        res.status(200).json({
            message:"got the product",
            product:product_data
        });

    } catch (error) {
        console.log("there is error in get by id product");
        manualLog(`error in get by id product :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"errror in get by id product",error:error})
    }
})

router.get('/getallproduct',distributer_session,async(req,res)=>{
    manualLog('entered in get all product')
    try {
        const Product = req.db.model('Product');
        const product_data = await Product.find();
        manualLog(`get all the prodcut`)
        res.status(200).json({
            message:"got all the product",
            product:product_data
        });

    } catch (error) {
        console.log("there is error in get all product");
        manualLog(`error in get all product :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"errror in get all product",error:error})
    }
})

router.delete('/deleteproduct/:id',distributer_session,async(req,res)=>{
    try {
        const {id} = req.params;
        const Product = req.db.model("Product");
        const deleted_product = await Product.findByIdAndDelete(id);
        const removed_imgs = deleted_product.product_photos.map((img)=>img.public_id)
        await cloudinary_delete(removed_imgs);
        res.status(200).json({
            message:"product deleted",
            product: deleted_product
        })
    } catch (error) {
        console.log('there is error in delete products')
        manualLog(`error in delete product :: ${JSON.stringify(error)}`)
        res.status(500).json({message:"error in delete product",error:error});
    }
})

module.exports = router