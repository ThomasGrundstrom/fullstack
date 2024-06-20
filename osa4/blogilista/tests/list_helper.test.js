const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const listWithOneBlog = [
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

const listWithNoLikes = [
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  }
]

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const emptyList = []
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 2)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {

  test('is returned when there is one', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, blogs[2])
  })

  test('is returned when the list contains one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.strictEqual(result, listWithOneBlog[0])
  })

  test('returns notification message when given array has no blogs', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, 'no blogs on list')
  })
})

describe('most blogs', () => {

  test('correct values returned with a big input list', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: "Robert C. Martin",
      blogs: 3
    }
    assert.deepStrictEqual(result, expected)
  })

  test('when there is one blog on the list', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    const expected = {
      author: "Robert C. Martin",
      blogs: 1
    }
    assert.deepStrictEqual(result, expected)
  })
  
  test('when there are no blogs on the list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, 'no blogs on list')
  })
})

describe('most likes', () => {

  test('correct values returned with big input list', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    assert.deepStrictEqual(result, expected)
  })

  test('when there is one blog on the list', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    const expected = {
      author: "Robert C. Martin",
      likes: 2
    }
    assert.deepStrictEqual(result, expected)
  })

  test('when there are no blogs on the list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, 'no blogs on list')
  })

  test('when no blog on the list has likes', () => {
    const result = listHelper.mostLikes(listWithNoLikes)
    const expected = {
      author: "Robert C. Martin",
      likes: 0
    }
    assert.deepStrictEqual(result, expected)
  })
})