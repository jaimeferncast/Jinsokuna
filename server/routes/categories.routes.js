const express = require('express')
const router = express.Router()
const Category = require('../models/category.model')

router.get('/:_id', (req, res) =>
  Category.find({ inMenu: req.params._id })
    .sort({ index: 1 })
    .then((categories) => res.json({ message: categories }))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
)

router.post('/new', (req, res) => {
  const category = { ...req.body }
  Category.create(category)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.delete('/:_id', (req, res) => {
  Category.findByIdAndDelete(req.params._id)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.put('/:_id', (req, res) => {
  const categoryData = ({ name, index, inMenus } = req.body)
  Category.findByIdAndUpdate(req.params._id, categoryData, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

module.exports = router
