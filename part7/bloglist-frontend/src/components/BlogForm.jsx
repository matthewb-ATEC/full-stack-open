import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  notifyWithTimeout,
  setNotificationStyle,
} from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogsReducer'
import blogsService from '../services/blogs'
import { useDispatch } from 'react-redux'

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
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid="title-input"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid="author-input"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid="url-input"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button data-testid="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
