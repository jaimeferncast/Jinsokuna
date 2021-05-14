const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'introduce el nombre del tipo de carta']
    },
    description: {
      type: String,
    },
  }
)

const Menu = mongoose.model('Menu', menuSchema)
module.exports = Menu
