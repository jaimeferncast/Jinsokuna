const express = require('express')
const router = express.Router()
const Product = require('../models/product.model')
const Category = require('../models/category.model')

router.get('/menus', (_req, res) => {
  Product.find({ isMenu: true })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find()
    const products = await Product.find()
    const categoryIds = categories.map(cat => cat._id.toString())
    const productsWithoutCategory = products.filter(prod => {
      return !prod.categories.some(cat => {
        return categoryIds.includes(cat.id.toString())
      })
    })

    const deletedProducts = await Promise.all(productsWithoutCategory.map(prod => {
      return Product.findByIdAndDelete(prod._id)
    }))

    Product.find()
      .then((products) => res.json({ message: products, deletedProducts }))
  } catch (err) {
    res.status(500).json({ ...err, message: err.message })
  }
})

router.post('/new', (req, res) => {
  const product = { ...req.body }
  Product.create(product)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.delete('/:_id', (req, res) => {
  Product.findByIdAndDelete(req.params._id)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.put('/:_id', (req, res) => {
  const productData = ({ name, isMenu, description, categories, price, allergies, menuProduct } = req.body)
  Product.findByIdAndUpdate(req.params._id, productData, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

module.exports = router
