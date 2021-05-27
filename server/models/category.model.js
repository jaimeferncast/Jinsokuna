const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    inMenu: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
    index: {
      type: Number,
    },
  }
)

categorySchema.pre('save', async function () {
  const indexes = await Category.find({ inMenu: this.inMenu }).select('')
  this.index = indexes.length + 1
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category
