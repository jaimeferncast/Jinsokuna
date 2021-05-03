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
    index: {
      type: Number,
    },
    price: {
      type: Number,
      min: 0,
      required: [true, 'introduce el precio del producto']
    },
    allergies: [{
      type: String
    }],
  }
)

productSchema.pre('save', async function () {
  const indexes = await Product.find({ category: this.category }).select('index')
  this.index = indexes.length + 1
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product
