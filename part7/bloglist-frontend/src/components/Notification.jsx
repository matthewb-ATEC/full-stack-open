import { useSelector } from 'react-redux'

const Notification = ({ message, messageStyle }) => {
  const notification = useSelector((state) => state.notification)

  const style = {
    background: 'grey',
    borderRadius: '8px',
    fontSize: '32px',
    padding: '8px',
    margin: '8px 0',
    border: messageStyle === 'error' ? '4px solid red' : '4px solid green',
    color: messageStyle === 'error' ? 'red' : 'green',
  }

  if (!notification) return null
  return <div style={style}>{notification}</div>
}

export default Notification
