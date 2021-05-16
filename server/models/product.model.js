const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = require('./category.model')

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
    },
    index: {
      type: Number,
    },
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
  }
)

productSchema.pre('save', async function () {
  const indexes = await Product.find({ category: this.category }).select('index')
  this.index = indexes.length + 1

  const [category] = await Category.find({ name: "Archivo" }).select('_id')
  this.category = this.category || category._id
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product
