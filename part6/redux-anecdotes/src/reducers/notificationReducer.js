import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: 'test notification',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        removeNotification() {
            return ''
        }
    }
})

export const { setNotification, removeNotification } = notificationSlice.actions

let timeoutId

export const notifyWithTimeout = (message, timeInSeconds = 5) => {
  return dispatch => {
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