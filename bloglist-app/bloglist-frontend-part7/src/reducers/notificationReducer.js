// src/reducers/notificationReducer
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, type: 'success' },
  reducers: {
    setNotification(state, action) {
      // Set the message and type
      return action.payload
    },
    clearNotification() {
      // Clear the message
      return { message: null, type: 'success' }
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const notify = (message, type = 'success', delay = 5) => {
  // Asynchronous Action Creator (Thunk):
  return (dispatch) => {
    // Dispatch a notification and then clear it after 'delay' seconds.
    dispatch(setNotification({ message, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, delay * 1000)
  }
}

export default notificationSlice.reducer
