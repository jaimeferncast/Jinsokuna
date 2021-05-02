const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'introduce el nombre de la categoría']
    },
    index: {
      type: Number,
      unique: true,
    },
  }
)

categorySchema.pre('save', async function () {
  const indexes = await Category.find().select('listPosition')
  this.index = indexes.length + 1
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category
