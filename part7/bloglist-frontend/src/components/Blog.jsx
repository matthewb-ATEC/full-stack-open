import { useState } from 'react'
import { useSelector } from 'react-redux'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const user = useSelector((state) => state.user)
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const increaseLikes = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      }
      updateBlog(updatedBlog)
    } catch (error) {
      console.log('Error updating likes: ', error)
    }
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        deleteBlog(blog)
      } catch (error) {
        console.log('Error deleting blog', error)
      }
    }
  }

  if (!showDetails)
    return (
      <div data-testid="blog-element" style={blogStyle}>
        <div>
          {blog.title} by {blog.author}
          <button
            data-testid="view-button"
            onClick={() => {
              setShowDetails(true)
            }}
          >
            view
          </button>
        </div>
      </div>
    )

  return (
    <div data-testid="blog-element" style={blogStyle}>
      <div>
        {blog.title}
        <button
          onClick={() => {
            setShowDetails(false)
          }}
        >
          hide
        </button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}{' '}
        <button data-testid="like-button" onClick={increaseLikes}>
          like
        </button>
      </div>
      <div>{blog.author}</div>
      {blog.user.username === user.username && (
        <button data-testid="delete-button" onClick={removeBlog}>
          remove
        </button>
      )}
    </div>
  )
}

export default Blog
