import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  notifyWithTimeout,
  setNotificationStyle,
} from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogsReducer'
import blogsService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { Box, Button, TextField, Typography } from '@mui/material'

const BlogForm = ({ blogFormRef }) => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url,
      likes: 0,
      comments: [],
    }

    try {
      const createdBlog = await blogsService.create(blog)
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(createdBlog))
      dispatch(setNotificationStyle('success'))
      dispatch(
        notifyWithTimeout(
          `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
          5
        )
      )
    } catch (error) {
      console.log(error)
      dispatch(setNotificationStyle('error'))
      dispatch(notifyWithTimeout('error adding blog', 5))
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Create New Blog
      </Typography>
      <form onSubmit={addBlog}>
        <Box sx={{ mb: 2 }}>
          <TextField
            data-testid="title-input"
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            data-testid="author-input"
            label="Author"
            variant="outlined"
            fullWidth
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            data-testid="url-input"
            label="URL"
            variant="outlined"
            fullWidth
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </Box>
        <Button
          data-testid="create-button"
          variant="contained"
          color="primary"
          type="submit"
        >
          Create
        </Button>
      </form>
    </Box>
  )
}

export default BlogForm
