import { createBlog, setBlogs } from '../reducers/blogsReducer'
import blogsService from '../services/blogs'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './Blog'

const BlogList = () => {
  const dispatch = useDispatch()

  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()

  useEffect(() => {
    const gettAllBlogs = async () => {
      const blogs = await blogsService.getAll()
      dispatch(setBlogs(blogs))
    }
    gettAllBlogs()
  }, [])

  const sortByLikes = (blogOne, blogTwo) => {
    return blogTwo.likes - blogOne.likes
  }

  return (
    <>
      <Togglable buttonLabel={'create new'} ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>

      {[...blogs].sort(sortByLikes).map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  )
}

export default BlogList
