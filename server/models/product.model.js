const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    categories: [{
      id: {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
      index: {
        type: Number,
      },
    }],
    price: [{
      subPrice: {
        type: Number,
        min: 0,
      },
      subDescription: {
        type: String,
        default: "",
      }
    }],
    allergies: [{
      type: String
    }],
    isMenuProduct: {
      type: Boolean,
      default: false,
    },
    isMenu: {
      type: Boolean,
      default: false,
    },
    menuContent: [{
      categoryName: {
        type: String
      },
      categoryDescription: {
        type: String,
        default: "",
      },
      products: [{
        name: String,
        description: String,
      }],
      canSelectProducts: {
        type: Boolean,
        default: true,
      },
      determinesPrice: {
        type: Boolean,
        default: false,
      },
    }],
    minPortions: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product
