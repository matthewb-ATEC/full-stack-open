import { useDispatch, useSelector } from 'react-redux'
import blogsService from '../services/blogs'
import { removeBlog, updateBlog } from '../reducers/blogsReducer'
import { useNavigate } from 'react-router-dom'
import commentsService from '../services/comments'
import {
  Button,
  Typography,
  Link,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Box,
} from '@mui/material'

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

  const handleAddComment = async (event) => {
    event.preventDefault()
    const comment = {
      comment: event.target.comment.value,
    }
    const updatedBlog = await commentsService.create(blog.id, comment)
    dispatch(updateBlog(updatedBlog))
  }

  if (!blog) return null

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
      <Typography variant="h4" gutterBottom>
        {blog.title} {blog.author}
      </Typography>
      <Link href={blog.url} target="_blank" rel="noopener">
        {blog.url}
      </Link>
      <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          {blog.likes} likes
        </Typography>
        <Button variant="contained" color="primary" onClick={increaseLikes}>
          like
        </Button>
      </Box>
      {blog.user.username === user.username ? (
        <Button variant="contained" color="secondary" onClick={deleteBlog}>
          remove
        </Button>
      ) : (
        <Typography variant="body2">added by {blog.author}</Typography>
      )}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6">comments</Typography>
        <form onSubmit={handleAddComment}>
          <TextField
            name="comment"
            label="Add a comment"
            variant="outlined"
            size="small"
            sx={{ marginRight: 1 }}
          />
          <Button type="submit" variant="contained" color="primary">
            add comment
          </Button>
        </form>
        <List>
          {blog.comments.map((comment) => (
            <ListItem key={comment.id}>
              <ListItemText primary={comment.comment} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  )
}

export default BlogView
