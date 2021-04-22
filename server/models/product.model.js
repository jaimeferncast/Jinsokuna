const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'introduce el nombre del producto']
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    listPosition: {
      type: Number,
      unique: true,
      reuired: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    allergies: [{
      type: String
    }],
  }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product
