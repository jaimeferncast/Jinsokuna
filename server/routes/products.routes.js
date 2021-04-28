const express = require('express')
const router = express.Router()
const Product = require('../models/product.model')

router.get('/', (_req, res) =>
  Product.find()
    .then((products) => res.json({ message: products }))
    .catch((error) =>
      res.status(500).json({
        code: 500,
        message: 'Error buscando los productos',
        error: error.message,
      })
    )
)

router.post('/new', (req, res) => {
  const product = { ...req.body }
  Product.create(product)
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({
        code: 500,
        message: "No se ha podido crear el producto",
        error: err.message
      })
    )
})

router.delete('/:_id', (req, res) => {
  Product.findByIdAndDelete(req.params._id)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido borrar el producto", err }))
})

router.put('/:_id', (req, res) => {
  const productData = ({ name, listPosition } = req.body)
  Product.findByIdAndUpdate(req.params._id, productData, { new: true })
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({
        code: 500,
        message: "No se ha podido modificar el producto",
        error: err.message
      })
    )
})

module.exports = router
