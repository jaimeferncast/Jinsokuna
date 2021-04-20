const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'introduce el nombre del producto']
    },
    price: {
      type: Number,
      min: 0,
    },
    allergies: [{
      type: String
    }],
  }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product
