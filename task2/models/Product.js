const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  variantAttribute: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  images: {
    mainImages: {
      type: Array,
      default: [],
      required: true,
    },
    thumbImages: {
      type: Array,
      default: [],
      required: true,
    },
  },
  variants: [
    {
      default: { type: Number, default: 1 },
      sku: { type: String },
      variantName: { type: String },
      priceDetails: {
        labelPrice: {
          type: Number,
        },
        listedPrice: {
          type: Number,
        },
        percengOff: {
          type: Number,
        },
        commission: {
          type: Number,
        },
        userEarnings: {
          type: Number,
        },
      },
    },
  ],
  imageRating: {
    type: Number,
  },
  assured: {
    type: Number,
  },
  crossBorder: {
    type: Number,
  },
  meetAndBuy: {
    type: Number,
  },
  productUrl: {
    type: String,
    required: true,
  },
  productSlug: {
    type: String,
    required: true,
  },
  // linking it up to a Seller model
  sellerDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
  },
  listedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
