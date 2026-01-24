// src/NotificationContext.jsx:
/* eslint-disable react-refresh/only-export-components */
// Centralise complex state logic, while offering global access to it.
import { createContext, useReducer, useContext } from 'react'
// Reducer: Takes the current state and an 'action', returning a new state
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload // Replace state with the new message and type (e.g., 'success').
    case 'CLEAR':
      return null // Resets state to null, hiding the notification.
    default:
      return state // Returns current state if the action type is unknown.
  }
}
// The Context: Makes the state available everywhere.
const NotificationContext = createContext()
// The Provider: Holds the actual state logic. Wraps the app to make state available to all components of the app.
export const NotificationContextProvider = (props) => {
  // useReducer returns: 1. The current state (notification) 2. A function to change it (dispatch).
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null // Initial state is null (no notification shown).
  )

  return (
    // Pass both the state and the dispatcher as an array in the value prop.
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}{' '}
      {/* This renders everything inside the provider (i.e., the App) */}
    </NotificationContext.Provider>
  )
}
// Export Custom Hooks:
// Return just the message/type: const message = useNotificationValue()
export const useNotificationValue = () => useContext(NotificationContext)[0]
// Return just the dispatcher: const dispatch = useNotificationDispatch()
export const useNotificationDispatch = () => useContext(NotificationContext)[1]

// Custom hook (Helper) for the "notify" pattern. Set message then clear after 5sec.
export const useNotify = () => {
  const dispatch = useNotificationDispatch()
  return (message, type = 'success') => {
    dispatch({ type: 'SET', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }
}

export default NotificationContext
