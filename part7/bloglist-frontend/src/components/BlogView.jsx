import { useDispatch, useSelector } from 'react-redux'
import blogsService from '../services/blogs'
import { removeBlog, updateBlog } from '../reducers/blogsReducer'
import { useNavigate } from 'react-router-dom'

const BlogView = ({ blog }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const increaseLikes = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      }
      const updatedResponseBlog = await blogsService.update(
        updatedBlog.id,
        updatedBlog
      )
      dispatch(updateBlog(updatedResponseBlog))
    } catch (error) {
      console.log('Error updating likes: ', error)
    }
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogsService.deleteBlog(blog.id)
        dispatch(removeBlog(blog))
        navigate('/blogs')
      } catch (error) {
        console.log('Error deleting blog', error)
      }
    }
  }

  if (!blog) return null

  return (
    <div data-testid="blog-element">
      <h1>
        {blog.title} {blog.author}
      </h1>
      <a href={blog.url} target="blank ">
        {blog.url}
      </a>
      <div>
        {blog.likes} likes
        <button data-testid="like-button" onClick={increaseLikes}>
          like
        </button>
      </div>
      {blog.user.username === user.username ? (
        <button data-testid="delete-button" onClick={deleteBlog}>
          remove
        </button>
      ) : (
        <div>added by {blog.author}</div>
      )}
      <br />
      <div>
        <h3>comments</h3>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogView
