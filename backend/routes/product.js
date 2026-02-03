const express = require('express');
const manualLog = require('../utils/manuallogger');
const path = require('path');
const user_session_checker = require('../middleware/user_session');
const { uploadFileToDO } = require("../utils/digitalocean");
const {upload,multerErrorHandler} = require('../middleware/multer');
const mongoose = require('mongoose');

const router = express.Router();

// ------------------- ADD PRODUCT -------------------
router.post(
  '/addproduct',
  user_session_checker('add_product'),
  upload.array('images[]', 5),
  multerErrorHandler,
  async (req, res) => {
    manualLog('entered add products route');
    console.log('file data', req.files);
    console.log('req body data', req.body);
    
    try {
      // ✅ Extract all fields from req.body
      const name = req.body.name;
      const description = req.body.description;
      const category = req.body.category;
      const brand = req.body.brand;
      const companyId = req.body.companyId;
      const color = req.body.color;
      const size = req.body.size;
      const price = req.body.price;
      const lowStockThreshold = req.body.lowStockThreshold;
      const status = req.body.status;
      const tags = req.body.tags;
      const supplier = req.body.supplier;
      const barcode = req.body.barcode;
      const dimensions = req.body.dimensions;
      const skus = req.body.skus;
      const innerPack = req.body.innerPack;
      const masterPack = req.body.masterPack;

      const tenent_username = req.tenent.D_dbname;
      const folderPath = `${tenent_username}/products`;

      // ✅ File upload to DigitalOcean
      let imageDocs = [];
      if (req.files && req.files.length > 0) {
        const res_DO = await Promise.all(
          req.files.map(async (file, index) => {
            const response = await uploadFileToDO(file.path, folderPath, file.mimetype);
            console.log("route response file upload", response);
            return { url: response, name: `image_${index + 1}` };
          })
        );

        console.log("digital ocean response", res_DO);
        imageDocs = res_DO.map((file) => ({
          url: file.url,
          doc_name: file.name,
        }));
        console.log("imageDocs", imageDocs);
      }

      // ✅ Validate images
      // if (imageDocs.length === 0) {
      //   return res.status(400).json({
      //     message: 'At least one product image is required',
      //   });
      // }

      // ✅ Handle dimensions - convert [Object: null prototype] to plain object
      let dimensionsObj = {
        length: null,
        width: null,
        height: null,
        weight: null,
        unit: 'cm',
        weightUnit: 'kg'
      };

      if (dimensions) {
        if (typeof dimensions === 'string') {
          dimensionsObj = JSON.parse(dimensions);
        } else if (typeof dimensions === 'object') {
          dimensionsObj = {
            length: dimensions.length || null,
            width: dimensions.width || null,
            height: dimensions.height || null,
            weight: dimensions.weight || null,
            unit: dimensions.unit || 'cm',
            weightUnit: dimensions.weightUnit || 'kg',
          };
        }
      }

      console.log('Processed dimensions:', dimensionsObj);

      // ✅ Handle SKUs - convert [Object: null prototype] to plain array
      let skusArray = [];
      
      if (skus) {
        if (typeof skus === 'string') {
          skusArray = JSON.parse(skus);
        } else if (Array.isArray(skus)) {
          skusArray = skus.map(sku => ({
            sku: sku.sku || '',
            color: sku.color || null,
            size: sku.size || null,
            price: sku.price || null,
            costPrice: sku.costPrice || null,
            stockQuantity: sku.stockQuantity || null,
            barcode: sku.barcode || null,
          }));
        }
      }

      console.log('Processed SKUs:', skusArray);

      // ✅ Convert companyId to ObjectId
      let companyObjectId = null;
      if (companyId && mongoose.Types.ObjectId.isValid(companyId)) {
        companyObjectId = new mongoose.Types.ObjectId(companyId);
      } else {
        return res.status(400).json({
          message: 'Valid Company ID is required',
        });
      }

      // ✅ Create product object with all fields
      // const Product = req.db.model('Product');
      // console.log('Creating new product with data:',Product);
      // Force register
  let Product;
  try {
    Product = req.db.model('Product');
  } catch (e) {
    Product = req.db.model('Product', productSchema);
  }
  
  // console.log('✅ Model registered!');
  // console.log('Fields:', Object.keys(Product.schema.paths));
  // console.log('Has "name"?', Product.schema.paths.name ? 'YES' : 'NO');
  // console.log('Has "brand"?', Product.schema.paths.brand ? 'YES' : 'NO');
      
      const productData = {
        name: name,
        description: description || null,
        category: category,
        brand: brand,
        companyId: companyObjectId,
        color: color || null,
        size: size || null,
        price: price || null,
        lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold, 10) : null,
        status: status || 'active',
        tags: tags || null,
        supplier: supplier,
        barcode: barcode || null,
        innerPack: innerPack || null,
        masterPack: masterPack || null,
        images: imageDocs,
        dimensions: dimensionsObj,
        skus: skusArray,
      };

      console.log('Product data to save:', JSON.stringify(productData, null, 2));

      const new_product = new Product(productData);

      console.log('New product instance:', new_product);

      await new_product.save();

      console.log('Product after save:', new_product);

      manualLog(
        `new product added :: ${new_product} by user: ${req.session.user.username}`
      );

      res.status(200).json({
        message: 'New product added successfully',
        product: new_product,
      });

    } catch (error) {
      console.log('Error in add new product:', error);
      console.log('Error name:', error.name);
      console.log('Error stack:', error.stack);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation error',
          errors: messages,
          details: error.errors
        });
      }

      manualLog(`Error in add new product :: ${JSON.stringify(error)}`);
      res.status(500).json({
        message: 'There was an error adding the product',
        error: error.message,
        stack: error.stack
      });
    }
  }
);

// ------------------- UPDATE PRODUCT -------------------
router.post(
  '/updateproduct/:id',
  user_session_checker('edit_product'),
  upload.array('images', 5),
  multerErrorHandler,
  async (req, res) => {
    manualLog('entered in update products');
    // manualLog(req.body)
    try {
      console.log(req.body)
      const { id } = req.params;
      let imageDocs = [] 
      const req_product_data = req.body;

      // Handle tags array
      // if (typeof req_product_data.tags === 'string') {
      //   req_product_data.tags = req_product_data.tags
      //     .split(',')
      //     .map((t) => t.trim())
      //     .filter((t) => t);
      // } else if (!Array.isArray(req_product_data.tags)) {
      //   req_product_data.tags = [];
      // }

      if (typeof req_product_data.skus === 'string') {
        try {
          req_product_data.skus = JSON.parse(req_product_data.skus);
        } catch (e) {
          console.error("Error parsing SKUs JSON:", e);
          req_product_data.skus = [];
        }
      }

      // Handle dimensions object
      if (typeof req_product_data.dimensions === 'string') {
        req_product_data.dimensions = JSON.parse(req_product_data.dimensions);
      }

      // Convert numeric fields
      if (req_product_data.lowStockThreshold)
        req_product_data.lowStockThreshold = parseInt(
          req_product_data.lowStockThreshold
        );

      const Product = req.db.model('Product');
      const product_data = await Product.findById(id);
      if (!product_data) return res.status(404).json({ message: 'Product not found' });

      const tenent_username = req.tenent.D_dbname;

      // Normalize images from body
      const updatedPublicIds = Array.isArray(req_product_data.images)
        ? req_product_data.images
        : req_product_data.images
        ? [req_product_data.images]
        : [];

      // Find removed image public_ids
      // const removedImgs = product_data.images.filter(
      //   (img) => !updatedPublicIds.includes(img.url)
      // );
      // const removedPublicIds = removedImgs.map((img) => img.url);

      // // Delete them from Cloudinary in parallel
      // await cloudinary_delete(removedPublicIds);

      if(req.files && Object.keys(req.files).length > 0){
        const folderPath = `${tenent_username}/products`;
        console.log('file data',req.files);

        // Frontend should send them as `existingImages` (array of URLs or JSON string)
        let existingImages = [];

        if (req.body.existingImages) {
          if (typeof req.body.existingImages === "string") {
            try {
              existingImages = JSON.parse(req.body.existingImages);
            } catch {
              // fallback if backend gets single string instead of JSON
              existingImages = [req.body.existingImages];
            }
          } else if (Array.isArray(req.body.existingImages)) {
            existingImages = req.body.existingImages;
          }
        }

        // Convert existing image URLs into correct format
        const retainedImages = existingImages.map((url) =>
          typeof url === "string" ? { url } : url
        );


        //file upload to the digital ocean 
          const res_DO = 
          await Promise.all(req.files.map(async (file) => {
            const response = await uploadFileToDO(file.path, folderPath,file.mimetype);
            console.log("route response file upload", response);
            return response;
          }));

          console.log("digital ocean response", res_DO);
          imageDocs = res_DO.map(url => ({ url }));
          req_product_data.images = [...retainedImages, ...imageDocs];
      }
          

      // Handle SKU updates (take directly from body)
      if (req_product_data.skus && Array.isArray(req_product_data.skus)) {
        req_product_data.skus = req_product_data.skus;
      }

      // Save product
      const updated_product = await Product.findByIdAndUpdate(
        { _id: id },
        { $set: req_product_data },
        { new: true }
      );

      manualLog(`Product updated: ${updated_product._id}`);
      res.status(200).json({
        message: 'Product updated successfully',
        product: updated_product,
      });
    } catch (error) {
      console.log('Error in update products', error);
      manualLog(`Error in update products :: `,error);
      res.status(500).json({ message: 'There was an error updating the product' });
    }
  }
);

// ------------------- GET / DELETE / COUNT ROUTES -------------------
router.get(
  '/getproduct/:id',
  user_session_checker('get_by_id_product'),
  async (req, res) => {
    manualLog('entered in get by id product');
    try {
      const { id } = req.params;
      const Product = req.db.model('Product');
      const product_data = await Product.findById(id).populate('companyId');
      if (!product_data) return res.status(404).json({ message: 'Product not found' });

      manualLog(`get the product by id :: ${product_data._id}`);
      res.status(200).json({
        message: 'got the product',
        product: product_data,
      });
    } catch (error) {
      console.log('there is error in get by id product');
      manualLog(`error in get by id product :: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'errror in get by id product', error: error });
    }
  }
);

router.get(
  '/getallproduct',
  user_session_checker('get_all_product'),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const status = req.query.status;
      const category = req.query.category;
      const companyId = req.query.companyId;
      const sortField = req.query.sortField || 'name';
      const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;

      const Product = req.db.model('Product');

      const matchStage = {};

      // Status filter
      if (status) matchStage.status = status;

      // Category filter
      if (category) matchStage.category = category;

      if (companyId) {
        matchStage.companyId = new mongoose.Types.ObjectId(companyId);
      }

      const pipeline = [
        {
          $lookup: {
            from: 'companies', // 🔥 MUST be MongoDB collection name
            localField: 'companyId',
            foreignField: '_id',
            as: 'company'
          }
        },
        { $unwind: '$company' }
      ];

      // 🔍 SEARCH (Product + Company)
      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { category: { $regex: search, $options: 'i' } },
              { sku: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { 'company.name': { $regex: search, $options: 'i' } }
            ]
          }
        });
      }

      pipeline.push(
        { $match: matchStage },
        { $sort: { [sortField]: sortDirection } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      );

      const productData = await Product.aggregate(pipeline);

      // Count query
      const countPipeline = pipeline.filter(stage =>
        !stage.$skip && !stage.$limit && !stage.$sort
      );

      const totalRecords = (await Product.aggregate([
        ...countPipeline,
        { $count: 'count' }
      ]))[0]?.count || 0;

      const totalPages = Math.ceil(totalRecords / limit);

      res.status(200).json({
        message: 'got all the product',
        product: productData,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: totalRecords,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });

    } catch (error) {
      console.error('error in get all product', error);
      res.status(500).json({
        message: 'error in get all product',
        error: error.message
      });
    }
  }
);

router.delete(
  '/deleteproduct/:id',
  user_session_checker('delete_product'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const Product = req.db.model('Product');
      const deleted_product = await Product.findByIdAndDelete(id);
      if (!deleted_product)
        return res.status(404).json({ message: 'Product not found' });

      res.status(200).json({
        message: 'product deleted',
        product: deleted_product,
      });
    } catch (error) {
      console.log('there is error in delete products');
      manualLog(`error in delete product :: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'error in delete product', error: error });
    }
  }
);

router.delete(
  '/deleteproductsbycompany/:companyId',
  user_session_checker('delete_company'),
  async (req, res) => {
    try {
      const { companyId } = req.params;
      const Product = req.db.model('Product');

      // Find all products for that company
      const products = await Product.find({ companyId });

      if (!products || products.length === 0) {
        return res.status(404).json({ message: 'No products found for this company' });
      }

      // Collect all Cloudinary image public_ids
      const all_imgs = products.flatMap((p) =>
        p.images ? p.images.map((img) => img.public_id) : []
      );

      // Delete products from DB
      const deleteResult = await Product.deleteMany({ companyId });

      // Delete images from Cloudinary
      if (all_imgs.length > 0) {
        await cloudinary_delete(all_imgs);
      }

      res.status(200).json({
        message: `All products of company ${companyId} deleted`,
        deletedCount: deleteResult.deletedCount,
      });
    } catch (error) {
      console.log('Error in delete products by company:', error);
      manualLog(
        `error in delete products by company :: ${JSON.stringify(error)}`
      );
      res
        .status(500)
        .json({ message: 'Error in delete products by company', error });
    }
  }
);

router.get(
  '/productcount/:companyId',
  user_session_checker('get_product'),
  async (req, res) => {
    try {
      const { companyId } = req.params;
      const Product = req.db.model('Product');

      const count = await Product.countDocuments({ companyId });

      res.status(200).json({
        message: 'Product count fetched successfully',
        companyId,
        productCount: count,
      });
    } catch (error) {
      console.log('Error in fetching product count:', error);
      manualLog(`error in product count :: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'Error in fetching product count', error });
    }
  }
);

// ------------------- SKU ROUTES -------------------
router.get(
  '/getskus/:productId',
  user_session_checker('get_by_id_product'),
  async (req, res) => {
    try {
      const { productId } = req.params;
      const Product = req.db.model('Product');
      const product = await Product.findById(productId).select('skus name');

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({
        message: 'SKUs retrieved successfully',
        productId: productId,
        productName: product.name,
        skus: product.skus,
      });
    } catch (error) {
      console.log('Error in get SKUs:', error);
      manualLog(`error in get SKUs :: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'Error retrieving SKUs', error });
    }
  }
);

router.put(
  '/updatesku/:productId/:skuId',
  user_session_checker('edit_product'),
  async (req, res) => {
    try {
      const { productId, skuId } = req.params;
      const skuData = req.body;

      const Product = req.db.model('Product');
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const skuIndex = product.skus.findIndex(
        (sku) => sku._id.toString() === skuId
      );
      if (skuIndex === -1) {
        return res.status(404).json({ message: 'SKU not found' });
      }

      // Update SKU
      Object.assign(product.skus[skuIndex], skuData);
      await product.save();

      res.status(200).json({
        message: 'SKU updated successfully',
        sku: product.skus[skuIndex],
      });
    } catch (error) {
      console.log('Error in update SKU:', error);
      manualLog(`error in update SKU :: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'Error updating SKU', error });
    }
  }
);


module.exports = router;
