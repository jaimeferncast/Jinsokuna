const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fontSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
)

const Font = mongoose.model('Font', fontSchema)
module.exports = Font
