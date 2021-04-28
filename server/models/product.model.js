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
  const positions = await Product.find({ category: this.category }).select('listPosition')
  console.log(positions)
  this.listPosition = positions.length + 1
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product
