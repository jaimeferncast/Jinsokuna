const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paletteSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
)

const Palette = mongoose.model('Palette', paletteSchema)
module.exports = Palette
