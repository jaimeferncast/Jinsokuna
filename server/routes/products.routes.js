const express = require('express')
const router = express.Router()
const Product = require('../models/product.model')
const Category = require('../models/category.model')

router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().select("_id")
    const products = await Product.find().select("category")
    products.map(prod => {
      if (!categories.some(cat => cat._id.toString() == prod.category.toString()))
        Product.findByIdAndDelete(prod._id).then()
    })

    Product.find().then((products) => res.json({ message: products }))
  }
  catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error buscando los productos',
      error: error.message,
    })
  }
})

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
  const productData = ({ name, index } = req.body)
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
