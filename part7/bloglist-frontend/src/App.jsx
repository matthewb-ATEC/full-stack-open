import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogsService from './services/blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { notifyWithTimeout } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
  createBlog,
  removeBlog,
  updateBlog,
  setBlogs,
} from './reducers/blogsReducer'
import { clearUser, setUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()

  useEffect(() => {
    blogsService.getAll().then((blogs) => {
      dispatch(setBlogs(blogs))
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogsService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loginCredentials = {
        username: username,
        password: password,
      }
      const user = await loginService.login(loginCredentials)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch(setUser(user))
      blogsService.setToken(user.token)
      setUsername('')
      setPassword('')

      dispatch(notifyWithTimeout('successfully logged in', 5))
    } catch (exception) {
      dispatch(notifyWithTimeout('wrong username or password', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())

    dispatch(notifyWithTimeout('successfully logged out', 5))
  }

  const newBlog = async (newBlog) => {
    try {
      const createdBlog = await blogsService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(createdBlog))

      dispatch(
        notifyWithTimeout(
          `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
          5
        )
      )
    } catch (error) {
      console.log(error)
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

  if (!user)
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification />

        <form data-testid="LoginForm" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              type="text"
              value={username}
              name="Username"
              data-testid="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              type="password"
              value={password}
              name="Password"
              data-testid="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      <br />

      <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
        <BlogForm createBlog={(blog) => newBlog(blog)} />
      </Togglable>

      {[...blogs].sort(sortByLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={(updatedBog) => changeBlog(updatedBog)}
          deleteBlog={(blogToDelete) => deleteBlog(blogToDelete)}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
