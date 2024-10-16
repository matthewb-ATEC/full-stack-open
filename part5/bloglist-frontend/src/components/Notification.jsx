const Notification = ({ message, messageStyle }) => {
  const errorStyle = {
    background: 'grey',
    border: '4px solid red',
    borderRadius: '8px',
    color: 'red',
    fontSize: '32px',
    padding: '8px',
    margin: '8px 0',
  }

  const successStyle = {
    background: 'grey',
    border: '4px solid green',
    borderRadius: '8px',
    color: 'green',
    fontSize: '32px',
    padding: '8px',
    margin: '8px 0',
  }

  const style = {
    background: 'grey',
    borderRadius: '8px',
    fontSize: '32px',
    padding: '8px',
    margin: '8px 0',
    border: messageStyle === 'error' ? '4px solid red' : '4px solid green',
    color: messageStyle === 'error' ? 'red' : 'green',
  }

  if (message === null) return null
  return <div style={style}>{message}</div>
}

export default Notification
