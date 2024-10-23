import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector((state) => state.notification.message)
  const messageStyle = useSelector((state) => state.notification.style)

  if (!message) return null
  return <Alert varient={messageStyle}>{message}</Alert>
}

export default Notification
