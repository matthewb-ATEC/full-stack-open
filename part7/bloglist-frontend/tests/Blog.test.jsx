import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../src/components/Blog'

describe('blog', () => {
  test('renders content', () => {
    const blog = {
      title: 'Title',
      author: 'Author',
      url: 'www.url.com',
      likes: 0,
    }

    const user = {
      username: 'Username',
      password: 'Password',
    }
    const mockUpdateHandler = vi.fn()
    const mockDeleteHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockUpdateHandler} deleteBlog={mockDeleteHandler} user={user}/>)

    screen.getByTestId('blog-element')
  })

  test('renders title and author but not likes or url by defualt', () => {
    const blog = {
      title: 'Title',
      author: 'Author',
      url: 'www.url.com',
      likes: 0,
    }
    const user = {
      username: 'Username',
      password: 'Password',
    }
    const mockUpdateHandler = vi.fn()
    const mockDeleteHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockUpdateHandler} deleteBlog={mockDeleteHandler} user={user}/>)

    const element = screen.getByTestId('blog-element')

    expect(element).toHaveTextContent(blog.title)
    expect(element).toHaveTextContent(blog.author)
    expect(element).not.toHaveTextContent(blog.likes)
    expect(element).not.toHaveTextContent(blog.url)
  })

  test('renders likes and url when show details has been clicked', async () => {
    const user = {
      username: 'Username',
      password: 'Password',
    }
    const blog = {
      title: 'Title',
      author: 'Author',
      url: 'www.url.com',
      likes: 0,
      user: user,
    }

    const mockUpdateHandler = vi.fn()
    const mockDeleteHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockUpdateHandler} deleteBlog={mockDeleteHandler} user={user}/>)

    const element = screen.getByTestId('blog-element')
    const mockUser = userEvent.setup()
    const button = screen.getByText('view')
    await mockUser.click(button)

    expect(element).toHaveTextContent(blog.likes)
    expect(element).toHaveTextContent(blog.url)
  })

  test('handler is called twice when clicking the like button twice', async () => {
    const user = {
      username: 'Username',
      password: 'Password',
    }
    const blog = {
      title: 'Title',
      author: 'Author',
      url: 'www.url.com',
      likes: 0,
      user: user,
    }

    const mockUpdateHandler = vi.fn()
    const mockDeleteHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockUpdateHandler} deleteBlog={mockDeleteHandler} user={user}/>)

    const element = screen.getByTestId('blog-element')
    const mockUser = userEvent.setup()
    const viewButton = screen.getByText('view')
    await mockUser.click(viewButton)
    const likeButton = screen.getByText('like')
    await mockUser.click(likeButton)
    await mockUser.click(likeButton)

    expect(mockUpdateHandler.mock.calls).toHaveLength(2)
  })
})
