const express = require('express')
const router = express.Router()
const Order = require('../models/order.model')

router.get("/:table", async (req, res) => {
  console.log(req.cookies)
  try {
    if (!req.cookies.orderId) { // client has no cookies
      const order = await Order.findOne({ table: req.params.table, status: "active" })
      if (order) {
        res.cookie("orderId", order._id, { maxAge: 86400000, path: "/" })
        res.status(200).json(order)
      }
      else {
        const order = await Order.create({ table: req.params.table })
        res.cookie("orderId", order._id, { maxAge: 86400000, path: "/" })
        res.status(200).json(order)
      }
    } else { // client has cookies
      const order = await Order.findOne({ _id: req.cookies.orderId })
      if (!order || order?.status === "closed") {
        res.clearCookie("orderId", { path: "/" })
        const order = await Order.create({ table: req.params.table })
        res.cookie("orderId", order._id, { maxAge: 86400000, path: "/" })
        res.status(200).json(order)
      }
      else res.status(200).json(order)
    }
  } catch (error) {
    res.status(500).json({ ...error, message: error.message })
  }
})

module.exports = router
