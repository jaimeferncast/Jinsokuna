const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
)

const Menu = mongoose.model('Menu', menuSchema)
module.exports = Menu
