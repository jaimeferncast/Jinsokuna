const express = require('express')
const router = express.Router()
const Menu = require('../models/menu.model')

router.get('/', (_req, res) =>
  Menu.find()
    .then((menus) => res.json({ message: menus }))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
)

router.post('/new', (req, res) => {
  const menu = { ...req.body }
  Menu.create(menu)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.delete('/:_id', (req, res) => {
  Menu.findByIdAndDelete(req.params._id)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.put('/:_id', (req, res) => {
  const menuData = ({ name, index } = req.body)
  Menu.findByIdAndUpdate(req.params._id, menuData, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

module.exports = router
