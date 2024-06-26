import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import React from 'react'
import BlogCreationForm from './components/BlogCreationForm'
import Togglable from './components/togglable'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const creationFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = async (blogObject) => {
    const token = user.token
    const newBlog = await blogService.create(blogObject, token)
    setBlogs(blogs.concat(newBlog))
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => 
      blog.id === updatedBlog.id
      ? updatedBlog
      : blog))
  }

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>  
    </div>    
  )

  return (
    <div>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in <button type='submit' onClick={handleLogout}>logout</button> </p>
        <Togglable buttonLabel='create new blog' ref={creationFormRef}>
          <BlogCreationForm createBlog={addBlog} />
        </Togglable>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} token={user.token} />
        )}
        </div>}
    </div>
  )
}

export default App