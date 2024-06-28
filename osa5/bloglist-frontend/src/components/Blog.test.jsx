import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Test',
  url: 'https://test.com',
  likes: 0,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

test('renders blog', () => {
  render(<Blog blog={blog} />)

  const element = screen.getByText('Component testing is done with react-testing-library Test')

  expect(element).toBeDefined()
})

test('url, likes and user are shown after view button click', async () => {
  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const hideButton = screen.getByText('hide')
  const blogInfo = hideButton.closest('div')

  expect(blogInfo).toHaveTextContent('https://test.com')
  expect(blogInfo).toHaveTextContent('likes: 0')
  expect(blogInfo).toHaveTextContent('Test User')
})

test('pressing like button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})