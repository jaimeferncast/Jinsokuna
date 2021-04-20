const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'introduce el nombre del producto']
    },
    price: {
      type: Number,
      min: 0,
    },
    allergies: [{
      type: String
    }],
  }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
