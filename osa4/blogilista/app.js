const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    request.token = token
  } else {
    request.token = null
  }
  next()
}
app.use(tokenExtractor)

const userExtractor = async (request, response, next) => {
  if (request.method !== 'GET') {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }
    request.user = await User.findById(decodedToken.id)
  }
  next()
}

const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', userExtractor, blogsRouter)
const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)
const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)

// Lisätty osassa 5
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'username already in use' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  next(error)
}

app.use(errorHandler)

module.exports = app