const express = require('express')
const mongoose = require('mongoose')
const { setUser } = require('../authentication.js')
const { addUser } = require('../seeder/index')
const { updateModel } = require('./routeUtilities')

const Users = mongoose.model('User')
const router = express.Router()

const sanitiseUser = ({ name, email, _id }) => ({
  name,
  email,
  _id
})

router.get('/users', setUser, async (req, res, next) => {
  const users = await Users.find()
  res.json(
    // Remove password from returned json
    users.map(user => sanitiseUser(user))
  )
})

router.get('/users/:id', setUser, async (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    const user = await Users.findById(req.params.id)
    return user ? res.json(user) : res.status(400).send('User not found')
  }
  return res.status(400).send('Invalid objectId')
})

router.post('/users', setUser, async (req, res, next) => {
  const user = await addUser(req.body)
  res.json(sanitiseUser(user))
})

router.patch('/users/:id', setUser, async (req, res, next) => {
  const update = { ...req.body }
  delete update._id
  delete update.email
  const user = await updateModel(Users, req.params.id, update)
  user ? res.json(user) : res.status(400).send('User not updated/found')
})

router.delete('/users/:id', setUser, async (req, res, next) => {
  const user = await Users.findByIdAndDelete(req.params.id)
  user ? res.json(sanitiseUser(user)) : res.status(400).send('User not found')
})

module.exports = router
