const express = require('express')
const router = express.Router()
const Category = require('../models/category.model')

router.get('/', (_req, res) =>
  Category.find()
    .sort({ index: 1 })
    .then((products) => res.json({ message: products }))
    .catch((error) =>
      res.status(500).json({
        code: 500,
        message: 'Error buscando las categorías',
        error: error.message,
      })
    )
)

router.post('/new', (req, res) => {
  const category = { ...req.body }
  Category.create(category)
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({
        code: 500,
        message: "No se ha podido crear la categoría",
        error: err.message
      })
    )
})

router.delete('/:_id', (req, res) => {
  Category.findByIdAndDelete(req.params._id)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ code: 500, message: "No se ha podido borrar la categoría", error: err.message }))
})

router.put('/:_id', (req, res) => {
  const categoryData = ({ name, index } = req.body)
  Category.findByIdAndUpdate(req.params._id, categoryData, { new: true })
    .then((response) => res.json(response))
    .catch((err) =>
      res.status(500).json({
        code: 500,
        message: "No se ha podido modificar la categoría",
        error: err.message
      })
    )
})

module.exports = router
