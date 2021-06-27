const express = require('express')
const router = express.Router()
const Order = require('../models/order.model')

router.get("/:table", async (req, res) => {
  try {
    if (!req.cookies.orderId) {
      const order = await Order.findOne({ table: req.params.table, status: "active" })
      if (order) {
        res.cookie("orderId", order._id)
        res.status(200).json(order)
      }
      else {
        const order = await Order.create({ table: req.params.table })
        res.cookie("orderId", order._id)
        res.status(200).json(order)
      }
    } else {
      const order = await Order.findOne({ _id: req.cookies.orderId })
      if (order.status === "active") res.status(200).json(order)
      else {

      }
    }
  } catch (error) {
    res.status(500).json({ ...error, message: error.message })
  }
})

module.exports = router
