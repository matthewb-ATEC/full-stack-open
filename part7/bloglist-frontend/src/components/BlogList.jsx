import { createBlog, setBlogs } from '../reducers/blogsReducer'
import blogsService from '../services/blogs'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Blog from './Blog'
import { List, ListItem } from '@mui/material'
import { Link } from 'react-router-dom'

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

      <List>
        {[...blogs].sort(sortByLikes).map((blog) => (
          <ListItem key={blog.id} component={Link} to={`/blogs/${blog.id}`}>
            <Blog blog={blog} />
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default BlogList
