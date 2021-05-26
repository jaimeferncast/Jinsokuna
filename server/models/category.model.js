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
    description: {
      type: String,
    },
    inMenus: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
    index: {
      type: Number,
    },
  }
)

categorySchema.pre('save', async function () {
  const indexes = await Category.find().select('index')
  this.index = indexes.length
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category
