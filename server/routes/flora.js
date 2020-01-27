const express = require('express')
const mongoose = require('mongoose')
const { setUser } = require('../authentication.js')
const { addFlora } = require('../seeder/index')
const { updateModel } = require('./routeUtilities')

const Flora = mongoose.model('Flora')
const router = express.Router()

router.get('/flora', async (req, res, next) => {
  const floraObj = await Flora.find()
  res.json(floraObj)
})

router.get('/flora/:id', async (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const flora = await Flora.findById(req.params.id)
    return flora ? res.json(flora) : res.status(400).send('Flora not found')
  }
  return res.status(400).send('Invalid objectId')
})

router.post('/flora', setUser, async (req, res, next) => {
  const flora = await addFlora(req.body)
  res.json(flora)
})

router.patch('/flora/:id', setUser, async (req, res, next) => {
  const update = { ...req.body }
  delete update._id
  const flora = await updateModel(Flora, req.params.id, update)
  flora ? res.json(flora) : res.status(400).send('Flora not updated/found')
})

router.delete('/flora/:id', setUser, async (req, res, next) => {
  const flora = await Flora.findByIdAndDelete(req.params.id)
  flora ? res.json(flora) : res.status(400).send('Flora not found')
})

module.exports = router
