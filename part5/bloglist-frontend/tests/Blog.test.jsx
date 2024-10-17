import { render, screen } from '@testing-library/react'
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
    const mockHandler = vi.fn()

    render(<Blog blog={blog} setBlogs={mockHandler} blogs={[blog]} user={user}/>)

    const element = screen.getByTestId('blog-element')

    screen.debug(element)
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
    const mockHandler = vi.fn()

    render(<Blog blog={blog} setBlogs={mockHandler} blogs={[blog]} user={user}/>)

    const element = screen.getByTestId('blog-element')

    expect(element).toHaveTextContent(blog.title)
    expect(element).toHaveTextContent(blog.author)
    expect(element).not.toHaveTextContent(blog.likes)
    expect(element).not.toHaveTextContent(blog.url)
    screen.debug(element)
  })
})
