// // src/reducers/blogReducer.js:

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit' // Import helper tools from Redux Toolkit.
import blogService from '../services/blogs' // Import the API service for blogs.

// ASYNC THUNKS:
// Fetch all blogs from backend
export const initializeBlogs = createAsyncThunk(
  'blogs/initializeBlogs',
  async () => {
    const blogs = await blogService.getAll()
    return blogs
  }
)
// Export an asynchronous Redux action (thunk) named `createBlog`
export const createBlog = createAsyncThunk('blogs/createBlog', async (blog) => {
  const newBlog = await blogService.create(blog) // Create a new blog
  return newBlog
})
// Export an asynchronous Redux action (thunk) named `likeBlog`
export const likeBlog = createAsyncThunk(
  'blogs/likeBlog', // Action type prefix. Redux Toolkit automatically creates: blogs/likeBlog/pending, blogs/likeBlog/fulfilled, and blogs/likeBlog/rejected.
  async (blog) => {
    // Payload creator function, runs when `dispatch(likeBlog(blog))` is called.
    const updatedBlog = {
      // Construct a new updated blog object (not mutating the original)
      ...blog, // Spread all existing properties of the original blog first, in order to create the new blog with all those properties
      likes: blog.likes + 1, // For the new blog object, increment the number of likes by 1. Representing the user's "like" action.
      user: blog.user.id || blog.user, // Normalize 'user' field before sending to the backend. The backend expects only the user id, not a full user object.
    } // So, if blog.user is an object (from backend fetch), use its `id`, if blog.user is already an id (from frontend state), use it directly.
    const returnedBlog = await blogService.update(blog.id, updatedBlog) // Send the updated blog to the backend using the blog service. `blog.id` identifies which blog to update. The backend responds with the updated blog object.
    return returnedBlog // Return the updated blog. Whatever is returned here becomes `action.payload` in the `blogs/likeBlog/fulfilled` reducer.
  }
)

export const removeBlog = createAsyncThunk('blogs/removeBlog', async (id) => {
  await blogService.remove(id) // Delete blog.
  return id
})

// SLICE:
const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Initialise Sort.
      .addCase(initializeBlogs.fulfilled, (state, action) => {
        return action.payload.sort((a, b) => b.likes - a.likes) // Replace state with fetched blogs, sorted by likes.
      })
      // Add new blog and re-sort.
      .addCase(createBlog.fulfilled, (state, action) => {
        state.push(action.payload)
        state.sort((a, b) => b.likes - a.likes)
      })
      // Update liked blog and re-sort.
      .addCase(likeBlog.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.findIndex((b) => b.id === updated.id)
        state[index] = updated
        state.sort((a, b) => b.likes - a.likes)
      })
      // Remove blog by id. No re-sort. Order is preserved.
      .addCase(removeBlog.fulfilled, (state, action) => {
        return state.filter((b) => b.id !== action.payload)
      })
  },
})

export default blogSlice.reducer
