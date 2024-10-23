import { useState, useEffect } from 'react'
import loginService from './services/login'
import blogsService from './services/blogs'
import Notification from './components/Notification'
import {
  notifyWithTimeout,
  setNotificationStyle,
} from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, setUser } from './reducers/userReducer'
import { Routes, Route, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'
import Users from './components/Users'
import User from './components/User'
import { setUsers } from './reducers/usersReducer'
import usersService from './services/users'
import BlogView from './components/BlogView'
import { setBlogs } from './reducers/blogsReducer'

const App = () => {
  const dispatch = useDispatch()

  const users = useSelector((state) => state.users)
  const user = useSelector((state) => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogs = useSelector((state) => state.blogs)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogsService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const getUsers = async () => {
      const users = await usersService.get()
      dispatch(setUsers(users))
    }
    getUsers()
  }, [])

  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await blogsService.getAll()
      dispatch(setBlogs(blogs))
    }
    getBlogs()
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

      dispatch(setNotificationStyle('success'))
      dispatch(notifyWithTimeout('successfully logged in', 5))
    } catch (exception) {
      dispatch(setNotificationStyle('error'))
      dispatch(notifyWithTimeout('wrong username or password', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    dispatch(setNotificationStyle('success'))
    dispatch(notifyWithTimeout('successfully logged out', 5))
  }

  const userMatch = useMatch('/users/:id')
  const selectedUser =
    userMatch && users ? users.find((u) => u.id === userMatch.params.id) : null

  const blogMatch = useMatch('/blogs/:id')
  const selectedBlog =
    blogMatch && blogs ? blogs.find((b) => b.id === blogMatch.params.id) : null

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

  // Check if users is still undefined
  if (!users || users.length === 0) {
    return <div>Loading users...</div>
  }

  // Check if blogs is still undefined
  if (!blogs || blogs.length === 0) {
    return <div>Loading blogs...</div>
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>{user.name} logged in</div>
      <br />
      <button onClick={handleLogout}>logout</button>

      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User user={selectedUser} />} />
        <Route path="/blogs/:id" element={<BlogView blog={selectedBlog} />} />
      </Routes>
    </div>
  )
}

export default App
