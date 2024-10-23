import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearUser } from '../reducers/userReducer'
import {
  notifyWithTimeout,
  setNotificationStyle,
} from '../reducers/notificationReducer'

const Navbar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    dispatch(setNotificationStyle('success'))
    dispatch(notifyWithTimeout('successfully logged out', 5))
  }

  const style = {
    background: 'lightgray',
    padding: 4,
    width: '100%',
  }

  return (
    <div style={style}>
      <Link to="/blogs">blogs</Link> <Link to="/users">users</Link>{' '}
      <span>{user.name} logged in</span>{' '}
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Navbar
