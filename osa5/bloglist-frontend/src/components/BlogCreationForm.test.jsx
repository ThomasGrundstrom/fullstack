import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreationForm from './BlogCreationForm'

test('<BlogCreationForm /> calls callback function with correct parameters on submit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogCreationForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('write title here')
  const author = screen.getByPlaceholderText('write author here')
  const url = screen.getByPlaceholderText('write url here')
  const createButton = screen.getByText('create')

  await user.type(title, 'Test title')
  await user.type(author, 'Test Author')
  await user.type(url, 'https://testurl.com')
  await user.click(createButton)

  const mockCalls = createBlog.mock.calls

  expect(mockCalls).toHaveLength(1)
  expect(mockCalls[0][0].title).toBe('Test title')
  expect(mockCalls[0][0].author).toBe('Test Author')
  expect(mockCalls[0][0].url).toBe('https://testurl.com')
})