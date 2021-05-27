const express = require('express')
const router = express.Router()
const Product = require('../models/product.model')
const Category = require('../models/category.model')

router.get('/', async (_req, res) => {
  Product.find()
    .then((products) => res.json({ message: products }))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
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
