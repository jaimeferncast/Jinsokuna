const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema(
  {
    table: String,
    products: [{
      type: Schema.Types.ObjectId,
      ref: "Product",
    }],
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
