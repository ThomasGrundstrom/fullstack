import { useState } from 'react'

const Blog = ({ blog, updateBlog, username, blogRemover }) => {
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
    updateBlog(updatedBlog, blog)
  }

  const removeButton = { display: username === blog.user.username ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible} >
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        likes: {blog.likes} <button onClick={handleLike}>like</button> <br />
        {blog.user.name} <br />
        <button style={removeButton} onClick={() => blogRemover(blog)}>remove</button>
      </div>
    </div>
  )
}

export default Blog