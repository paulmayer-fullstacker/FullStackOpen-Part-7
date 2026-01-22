// src/store.js:
import { configureStore } from '@reduxjs/toolkit' // Import Redux Toolkit helper for store creation
import notificationReducer from './reducers/notificationReducer' // Import reducers for each slice of state (notifications, blogs and users).
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  // Create the Redux store.
  reducer: {
    // Register notification, blogs and user slice in Redux.
    notification: notificationReducer, // notification handles notification message + type.
    blogs: blogReducer, // blogs holds the array of blog objects.
    user: userReducer, // user holds the currently logged-in user (or null in no user logged in).
  },
})

export default store // Export store for the Provider.
