const mongoose = require('mongoose');

// Image schema
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please enter image URL'],
  },
  public_id: {
    type: String,
    required: [true, 'Please enter the public ID'],
  },
});

// SKU schema for variants (color, size, price, stock)
const skuSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true, // unique across DB
  },
  color: { type: String },
  size: { type: String },
  price: { type: Number, required: true },
  costPrice: { type: Number },
  stockQuantity: { type: Number, default: 0 },
  barcode: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    subcategory: {
      type: String,
    },
    brand: {
      type: String,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    lowStockThreshold: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
      required: true,
    },
    tags: {
      type: [String],
    },
    supplier: {
      type: String,
    },
    barcode: {
      type: String,
    },
    images: {
      type: [imageSchema],
      validate: {
        validator: function (arr) {
          return arr.length > 0; // at least 1 photo required
        },
        message: 'At least one product photo is required',
      },
      required: true,
    },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      weight: { type: Number },
      unit: {
        type: String,
        enum: ['cm', 'inch'],
        default: 'cm',
      },
      weightUnit: {
        type: String,
        enum: ['kg', 'lb'],
        default: 'kg',
      },
    },

    // ✅ NEW FIELD
    skus: [skuSchema],
  },
  { timestamps: true }
);

module.exports = productSchema;
