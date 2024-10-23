import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return { ...state, message: action.payload }
    },
    removeNotification(state, action) {
      return { ...state, message: '' }
    },
    setNotificationStyle(state, action) {
      return { ...state, style: action.payload }
    },
  },
})

export const { setNotification, removeNotification, setNotificationStyle } =
  notificationSlice.actions

let timeoutId
export const notifyWithTimeout = (message, timeInSeconds = 5) => {
  return (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    dispatch(setNotification(message))

    timeoutId = setTimeout(() => {
      dispatch(removeNotification())
    }, timeInSeconds * 1000)
  }
}

export default notificationSlice.reducer
