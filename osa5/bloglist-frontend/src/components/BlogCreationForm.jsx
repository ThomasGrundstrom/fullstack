import { useState } from 'react'

const BlogCreationForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className='blogCreationForm'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:
        <input
          type='text'
          value={title}
          name='Title'
          onChange={({ target }) => setTitle(target.value)}
          placeholder='write title here'
        />
        <br />
        author:
        <input
          type='text'
          value={author}
          name='Author'
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='write author here'
        />
        <br />
        url:
        <input
          type='text'
          value={url}
          name='Url'
          onChange={({ target }) => setUrl(target.value)}
          placeholder='write url here'
        />
        <br />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogCreationForm