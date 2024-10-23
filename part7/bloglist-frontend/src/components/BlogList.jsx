import {
  createBlog,
  removeBlog,
  updateBlog,
  setBlogs,
} from '../reducers/blogsReducer'
import blogsService from '../services/blogs'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  notifyWithTimeout,
  setNotificationStyle,
} from '../reducers/notificationReducer'

const BlogList = () => {
  const dispatch = useDispatch()

  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()

  useEffect(() => {
    blogsService.getAll().then((blogs) => {
      dispatch(setBlogs(blogs))
    })
  }, [])

  const newBlog = async (newBlog) => {
    try {
      const createdBlog = await blogsService.create(newBlog)
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
  }

  const changeBlog = async (updatedBlog) => {
    const blog = await blogsService.update(updatedBlog.id, updatedBlog)
    dispatch(updateBlog(blog))
  }

  const deleteBlog = async (blogToDelete) => {
    blogsService.deleteBlog(blogToDelete.id)
    dispatch(removeBlog(blogToDelete))
  }

  const sortByLikes = (blogOne, blogTwo) => {
    return blogTwo.likes - blogOne.likes
  }

  return (
    <>
      <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
        <BlogForm createBlog={(blog) => newBlog(blog)} />
      </Togglable>

      {[...blogs].sort(sortByLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={(updatedBog) => changeBlog(updatedBog)}
          deleteBlog={(blogToDelete) => deleteBlog(blogToDelete)}
        />
      ))}
    </>
  )
}

export default BlogList
