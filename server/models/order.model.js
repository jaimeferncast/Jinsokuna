const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema(
  {
    table: Number,
    order: [{
      type: Schema.Types.ObjectId,
      ref: "Product",
    }],
    allergies: [{
      type: String
    }],
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
