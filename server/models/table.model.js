const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    number: Number
  }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product