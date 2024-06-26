import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, token }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    const returnedBlog = await blogService.edit(blog.id, updatedBlog, token)
    updateBlog(returnedBlog)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        likes: {blog.likes} <button onClick={handleLike}>like</button> <br />
        {blog.user.name}
      </div>
    </div>
  )
}

export default Blog