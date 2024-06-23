const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('../app')

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body
  if (password.length < 3) {
    response.status(400).json({ error: 'password is too short' })
  } else if (username.length < 3) {
    response.status(400).json({ error: 'username is too short' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
      .catch(error => next(error))

    response.status(201).json(savedUser)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  response.json(users)
})

module.exports = usersRouter