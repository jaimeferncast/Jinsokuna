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
    isMenu: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
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
        type: String
      }
    }],
    allergies: [{
      type: String
    }],
    menuProduct: {
      type: Boolean,
      default: false,
    },
  }
)

productSchema.pre('save', async function () {
  const indexes = await Product.find({ "categories.id": this.categories[0].id }).select('')
  this.categories[0].index = indexes.length + 1
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product
