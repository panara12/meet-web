const mongoose = require('mongoose');

// ✅ Image schema – unchanged (simple structure)
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please enter image URL'],
  },
  doc_name: {
    type: String,
    default: null,
  }
});

// ✅ SKU schema for product variants (color, size, pricing, etc.)
const skuSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },
  color: { type: String }, // Added flexibility for product color
  size: { type: String },  // Variant size (e.g., 1L, XL)
  price: { type: Number, default: null }, // Now string or null for easy currency handling
  costPrice: { type: Number, default: null }, // Optional cost
  stockQuantity: { type: Number, default: null }, // Stock as string (nullable)
  barcode: { type: String, default: null }, // SKU-level barcode (nullable)
});

// ✅ Main Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },

    // Description – optional now
    description: {
      type: String,
      default: null,
    },

    // Category – can be null (was required before)
    category: {
      type: String,
      required: [true, 'Brand name is required'],
    },

    // Brand name – string and required
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
    },

    // Reference to the company document
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },

    color:{
      type:String,
      default:null,
    },
    size:{  
      type:String,
      default:null,
    },

    price:{
      type:Number,
      default:null
    },

    costPrice:{
      type:Number,
      default:null
    },

    // Low stock threshold – optional integer
    lowStockThreshold: {
      type: Number,
      default: null,
    },

    // Enum for product state
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
      required: true,
    },

    // Comma-separated tags converted into array
    tags: {
      type: String, // stored as a single comma-separated string
      default: null,
    },

    // Supplier name – new field
    supplier: {
      type: String,
      required: [true, 'Supplier name is required'],
    },

    // Product-level barcode – optional
    barcode: {
      type: String,
      default: null,
    },
    innerPack:{
      type:String,
      default:null,
    },
    masterPack:{
      type:String,
      default:null,
    },

    // Array of image URLs
    images: {
      type: [imageSchema],
      required: false,
    },

    // ✅ Dimensions (now fully nullable, with default units)
    dimensions: {
      length: { type: String, default: null },
      width: { type: String, default: null },
      height: { type: String, default: null },
      weight: { type: String, default: null },
      unit: {
        type: String,
        enum: ['cm', 'inch', 'm'],
        default: 'cm',
      },
      weightUnit: {
        type: String,
        enum: ['gram', 'kg'],
        default: 'kg',
      },
    },

    // ✅ Variants list (SKUs)
    skus: {
      type: [skuSchema],
      default: [],
    },
  },
  { timestamps: true }
);



module.exports =  productSchema;