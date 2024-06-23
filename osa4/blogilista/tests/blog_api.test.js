const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})
  for (let user of helper.initialUsers) {
    let hashedPassword = await bcrypt.hash(user.password, 10)
    let userObject = new User({
      username: user.username,
      name: user.name,
      passwordHash: hashedPassword
    })
    await userObject.save()
  }
})

describe('initial setup', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog identifier is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert.strictEqual(typeof blog.id, 'string')
    })
  })
})

describe('adding blogs', () => {
  test('blog can be added', async () => {
    const response = await api.get('/api/blogs')

    const amount = response.body.length
    const newBlog = {
      title: 'Blog added in testing',
      author: 'Test',
      url: 'http://testblog',
      likes: 7
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const after = await api.get('/api/blogs')
    assert.strictEqual(after.body.length, amount + 1)
  })

  test('if likes are not set, default value is 0', async () => {
    const newBlog = {
      title: 'Blog with no predetermined likes',
      author: 'Test',
      url: 'http://testblog'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      if (blog.title === 'Blog with no predetermined likes') {
        assert.strictEqual(blog.likes, 0)
      }
    })
  })

  test('response has bad request code if no title or url', async () => {
    const noTitle = {
      author: 'Test',
      url: 'http://notitle',
      likes: 3
    }
    await api
      .post('/api/blogs')
      .send(noTitle)
      .expect(400)

    const noUrl = {
      title: 'No url',
      author: 'Test',
      likes: 2
    }
    await api
      .post('/api/blogs')
      .send(noUrl)
      .expect(400)
  })
})

test('blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})


test('blog can be edited', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToEdit = blogsAtStart[0]

  const updatedBlog = {
    title: blogToEdit.title,
    author: blogToEdit.author,
    url: blogToEdit.url,
    likes: 77
  }

  await api
    .put(`/api/blogs/${blogToEdit.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd[0].likes, 77)
})

describe('user tests', () => {
  test('there is one user', async () => {
    const response = await helper.usersInDb()

    assert.strictEqual(response.length, 1)
  })

  test('a valid user can be added', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  test('get call works for users', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('cannot create account with too short username or password', async () => {
    const usersAtStart = await helper.usersInDb()

    const tooShortUsername = {
      username: 'ml',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }
    let response = await api
      .post('/api/users')
      .send(tooShortUsername)
      .expect(400)
    
    assert.strictEqual(response.body.error, 'username is too short')

    const tooShortPassword = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'sa'
    }
    response = await api
      .post('/api/users')
      .send(tooShortPassword)
      .expect(400)
    
    assert.strictEqual(response.body.error, 'password is too short')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('cannot create accounts with duplicate usernames', async () => {
    const usersAtStart = await helper.usersInDb()

    const duplicateUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sekret'
    }
    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'username already in use')

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})