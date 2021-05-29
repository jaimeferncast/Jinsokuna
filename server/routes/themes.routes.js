const express = require('express')
const router = express.Router()
const Font = require('../models/font.model')
const Palette = require('../models/palette.model')

router.get('/fonts', (_req, res) =>
  Font.find()
    .then((fonts) => res.json({ message: fonts }))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
)

router.get('/palettes', (_req, res) =>
  Palette.find()
    .then((palette) => res.json({ message: palette }))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
)

router.post('/fonts/new', (req, res) => {
  const font = { ...req.body }
  Font.create(font)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.post('/palettes/new', (req, res) => {
  const palettes = { ...req.body }
  Palette.create(palettes)
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.put('/palettes/:name', (req, res) => {
  Palette.findOneAndUpdate({}, { name: req.params.name }, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

router.put('/fonts/:name', (req, res) => {
  Font.findOneAndUpdate({}, { name: req.params.name }, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json({ ...err, message: err.message }))
})

module.exports = router
