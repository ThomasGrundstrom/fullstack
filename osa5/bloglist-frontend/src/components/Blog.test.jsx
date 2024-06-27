import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog', () => {

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test',
    url: 'https://test.com',
    user: {
      username: 'testuser'
    }
  }

  const updateBlog = () => {}
  const blogRemover = () => {}

  const { container } = render(<Blog blog={blog} updateBlog={updateBlog} token='testtoken' username='testuser' blogRemover={blogRemover} />)

  const text = container.querySelector('#blog-minimized')

  expect(text).toHaveTextContent('Component testing is done with react-testing-library')
})