const express = require('express');
const manualLog = require('../utils/manuallogger');
const path = require('path');
const user_session_checker = require('../middleware/user_session');
const { uploadFileToDO } = require("../utils/digitalocean");
const {upload,multerErrorHandler} = require('../middleware/multer');

const router = express.Router();

// ------------------- ADD PRODUCT -------------------
router.post(
  '/addproduct',
  user_session_checker('add_product'),
  upload.array('images', 5),
  async (req, res) => {
    manualLog('entered add products route');
    try {
      const {
        name,
        description,
        category,
        subcategory,
        brand,
        companyId,
        price,
        costPrice,
        stockQuantity,
        lowStockThreshold,
        status,
        tags,
        supplier,
        barcode,
        dimensions,
        skus, // full SKUs come from req.body
      } = req.body;

      const tenent_username = req.tenent.D_dbname;
      const folderPath = `${tenent_username}/products`;
      console.log('file data',req.files);

      //file upload to the digital ocean 
      const res_DO = 
        await Promise.all(req.files.map(async (file) => {
          const response = await uploadFileToDO(file.path, folderPath,file.mimetype);
          console.log("route response file upload", response);
          return response;
        }));


      console.log("digital ocean response", res_DO);
      const imageDocs = res_DO.map(url => ({ url }));

      // Handle tags array
      const tagsArray = Array.isArray(tags)
        ? tags
        : tags
        ? tags.split(',').map((t) => t.trim()).filter((t) => t)
        : [];

      // Handle dimensions object
      const dimensionsObj =
        typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions || {};

      
      // Use SKUs directly from request body (no generation)
      const skusArray = Array.isArray(skus) ? skus : [];

      const Product = req.db.model('Product');
      const new_product = new Product({
        name,
        description,
        category,
        subcategory,
        brand,
        companyId,
        price: price ? parseFloat(price) : undefined,
        costPrice: costPrice ? parseFloat(costPrice) : undefined,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
        lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 0,
        status: status || 'active',
        tags: tagsArray,
        supplier,
        barcode,
        images: imageDocs,
        dimensions: dimensionsObj,
        skus: skusArray,
      });

      

      await new_product.save();

      manualLog(
        `new product added :: ${new_product._id} by user: ${req.session.user.username}`
      );
      res
        .status(200)
        .json({ message: 'new product added successfully', product: new_product });
    } catch (error) {
      console.log('there is error in add new products');
      manualLog(`there is error in add new products :: ${JSON.stringify(error)}`);
      res
        .status(500)
        .json({ message: 'there is error in add new products', error: error });
    }
  }
);

// ------------------- UPDATE PRODUCT -------------------
router.post(
  '/updateproduct/:id',
  user_session_checker('edit_product'),
  upload.array('images', 5),
  async (req, res) => {
    manualLog('entered in update products');
    try {
      const { id } = req.params;
      const req_product_data = req.body;

      // Handle tags array
      if (typeof req_product_data.tags === 'string') {
        req_product_data.tags = req_product_data.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t);
      } else if (!Array.isArray(req_product_data.tags)) {
        req_product_data.tags = [];
      }

      // Handle dimensions object
      if (typeof req_product_data.dimensions === 'string') {
        req_product_data.dimensions = JSON.parse(req_product_data.dimensions);
      }

      // Convert numeric fields
      if (req_product_data.price)
        req_product_data.price = parseFloat(req_product_data.price);
      if (req_product_data.costPrice)
        req_product_data.costPrice = parseFloat(req_product_data.costPrice);
      if (req_product_data.stockQuantity)
        req_product_data.stockQuantity = parseInt(req_product_data.stockQuantity);
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

      
      const folderPath = `${tenent_username}/products`;
      console.log('file data',req.files);

      // Retain images still present
      const retainedImages = product_data.images.filter((img) =>
        updatedPublicIds.includes(img.url)
      );

      //file upload to the digital ocean 
      const res_DO = 
        await Promise.all(req.files.map(async (file) => {
          const response = await uploadFileToDO(file.path, folderPath,file.mimetype);
          console.log("route response file upload", response);
          return response;
        }));


      console.log("digital ocean response", res_DO);
      const imageDocs = res_DO.map(url => ({ url }));
      req_product_data.images = [...retainedImages, ...imageDocs];

      

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
      manualLog(`Error in update products :: ${JSON.stringify(error)}`);
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
      const product_data = await Product.findById(id);
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
    manualLog('entered in get all product');
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      const Product = req.db.model('Product');

      // Get products with pagination
      const product_data = await Product.find()
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 }); // Sort by newest first

      // Get total count for pagination info
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limitNumber);

      manualLog(`get all the products - page: ${pageNumber}, limit: ${limitNumber}`);
      res.status(200).json({
        message: 'got all the product',
        product: product_data,
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalProducts: totalProducts,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
      });
    } catch (error) {
      console.log('there is error in get all product');
      manualLog(`error in get all product :: ${JSON.stringify(error)}`);
      res.status(500).json({ message: 'errror in get all product', error: error });
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

      const removed_imgs = deleted_product.images.map((img) => img.public_id);
      await cloudinary_delete(removed_imgs);

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
