import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../src/components/BlogForm'

describe('blog form', () => {
  test('calls the event handler with the right details when a new blog is created', async () => {

    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={mockHandler} />)

    // Fill out the form fields
    const titleInput = screen.getByTestId('title-input')
    const authorInput = screen.getByTestId('author-input')
    const urlInput = screen.getByTestId('url-input')
    const createButton = screen.getByTestId('create-button')

    await user.type(titleInput, 'Testing React Forms')
    await user.type(authorInput, 'React Tester')
    await user.type(urlInput, 'https://reactforms.com')

    await user.click(createButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toEqual({
      title: 'Testing React Forms',
      author: 'React Tester',
      url: 'https://reactforms.com',
      likes: 0
    })
  })
})
