const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteFinder = (blogs) => {
    let maxLikesBlog = blogs[0]
    for (let i = 1; i < blogs.length; i++) {
      if (blogs[i].likes > maxLikesBlog.likes) {
        maxLikesBlog = blogs[i]
      }
    }
    return maxLikesBlog
  }

  return blogs.length === 0
    ? 'no blogs on list'
    : favoriteFinder(blogs)
}

const mostBlogs = (blogs) => {
  const blogCounts = blogs.reduce((counts, blog) => {
    if (counts[blog.author]) {
      counts[blog.author]++
    } else {
      counts[blog.author] = 1
    }
    return counts
  }, {})

  const highestCountAuthor = (blogCounts) => {
    let maxBlogs = 0
    let topAuthor = ''

    for (const [author, count] of Object.entries(blogCounts)) {
      if (count > maxBlogs) {
        maxBlogs = count
        topAuthor = author
      }
    }
    const result = {
      author: topAuthor,
      blogs: maxBlogs
    }

    return result
  }

  return blogs.length === 0
    ? 'no blogs on list'
    : highestCountAuthor(blogCounts)
}

const mostLikes = (blogs) => {
  const likeCounts = blogs.reduce((counts, blog) => {
    if (counts[blog.author]) {
      counts[blog.author] += blog.likes
    } else {
      counts[blog.author] = blog.likes
    }
    return counts
  }, {})

  const mostLikedAuthor = (likeCounts) => {
    let maxLikes = 0
    let topAuthor = ''

    for (const [author, count] of Object.entries(likeCounts)) {
      if (count >= maxLikes) {
        maxLikes = count
        topAuthor = author
      }
    }
    const result = {
      author: topAuthor,
      likes: maxLikes
    }

    return result
  }

  return blogs.length === 0
    ? 'no blogs on list'
    : mostLikedAuthor(likeCounts)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}