const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // required field
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    industry: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      required: true, // required field
      trim: true
    },
    phone: {
      type: String,
      required: true, // required field
      trim: true
    },
    email: {
      type: String,
      default: ""
    },
    website: {
      type: String,
      default: ""
    },
    establishedDate: {
      type: String
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    gstNumber: {
      type: String,
      default: ""
    },
    panNumber: {
      type: String,
      default: ""
    },
    accountNumber: {
      type: String,
      default: ""
    },
    bankDetails: {
      bankName: { type: String, default: "" },
      branchName: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
      accountHolderName: { type: String, default: "" },
      accountType: {
        type: String,
        enum: ["current", "savings","Cash Credit","Overdraft"],
        default: "current"
      },
      swiftCode: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

module.exports = companySchema;
