import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector((state) => state.notification.message)
  const messageStyle = useSelector((state) => state.notification.style)

  const style = {
    background: 'grey',
    borderRadius: '8px',
    fontSize: '32px',
    padding: '8px',
    margin: '8px 0',
    border: messageStyle === 'error' ? '4px solid red' : '4px solid green',
    color: messageStyle === 'error' ? 'red' : 'green',
  }

  if (!message) return null
  return <div style={style}>{message}</div>
}

export default Notification
