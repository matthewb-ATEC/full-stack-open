import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearUser } from '../reducers/userReducer'
import {
  notifyWithTimeout,
  setNotificationStyle,
} from '../reducers/notificationReducer'
import { AppBar, Button, Toolbar, Typography } from '@mui/material'

const Navbar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    dispatch(setNotificationStyle('success'))
    dispatch(notifyWithTimeout('successfully logged out', 5))
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/blogs">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Typography variant="body1">{user.name} logged in</Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
