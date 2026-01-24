// // src/App.jsx:
// import { useState, useEffect, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux' // Added useSelector to pull data from Redux

// // REDUX ACTIONS: Import the thunks from your new blogReducer
// import {
//   initializeBlogs,
//   createBlog,
//   likeBlog,
//   removeBlog,
// } from './reducers/blogReducer'
// import { notify } from './reducers/notificationReducer'

// import Blog from './components/Blog'
// import blogService from './services/blogs'
// import loginService from './services/login'
// import Notification from './components/Notification'
// import Togglable from './components/Togglable'
// import BlogForm from './components/BlogForm'

// const App = () => {
//   const dispatch = useDispatch()

//   /* 1. REDUX STATE REPLACEMENT:
//      We remove const [blogs, setBlogs] = useState([]) and replace it with useSelector.
//      The sorting logic is now handled here so that the UI always shows sorted blogs.
//   */
//   const blogs = useSelector((state) => {
//     const blogList = state.blogs || []
//     // We access 'state.blogs' (defined in store.js)
//     // We spread into a new array [...] to avoid mutating the Redux state directly
//     return [...blogList].sort((a, b) => (b.likes || 0) - (a.likes || 0))
//   })

//   // Keep local state for user and login form
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [user, setUser] = useState(null)

//   const blogFormRef = useRef()

//   /* 2. INITIALIZATION:
//      Instead of a local fetchBlogs function, we just dispatch the initialize action.
//   */
//   useEffect(() => {
//     dispatch(initializeBlogs())
//   }, [dispatch])

//   // Restore session from local storage
//   useEffect(() => {
//     const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
//     if (loggedUserJSON) {
//       const user = JSON.parse(loggedUserJSON)
//       if (user && user.token) {
//         setUser(user)
//         blogService.setToken(user.token)
//         // No need to call fetchBlogs here, the first useEffect handles initialization
//       } else {
//         window.localStorage.removeItem('loggedBloglistUser')
//       }
//     }
//   }, [])

//   const handleLogin = async (event) => {
//     event.preventDefault()
//     try {
//       const user = await loginService.login({ username, password })
//       window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
//       blogService.setToken(user.token)
//       setUser(user)
//       setUsername('')
//       setPassword('')
//       dispatch(notify(`Welcome, ${user.name}!`, 'success'))
//     } catch (exception) {
//       const errorMessage =
//         exception.response?.data?.error || 'wrong username or password'
//       dispatch(notify(errorMessage, 'failure'))
//     }
//   }

//   const handleLogout = () => {
//     window.localStorage.removeItem('loggedBloglistUser')
//     blogService.setToken(null)
//     setUser(null)
//     // Redux state will persist, but Blog component handles conditional buttons via 'currentUser' prop
//   }

//   /* 3. REFACTORED HANDLERS:
//      These now dispatch actions to the Redux Store instead of calling services directly.
//   */
//   const handleCreateNewBlog = async (blogObject) => {
//     try {
//       // dispatch(createBlog) handles the API call AND the state update
//       dispatch(createBlog(blogObject))
//       blogFormRef.current.toggleVisibility()
//       dispatch(
//         notify(
//           `a new blog ${blogObject.title} by ${user.name} added`,
//           'success'
//         )
//       )
//     } catch {
//       dispatch(notify('Blog creation failed.', 'failure'))
//     }
//   }

//   const handleLike = (blogId) => {
//     // Find the specific blog from our Redux-sourced 'blogs' array
//     const blogToLike = blogs.find((b) => b.id === blogId)
//     if (blogToLike) {
//       dispatch(likeBlog(blogToLike))
//       dispatch(notify(`Liked blog: ${blogToLike.title}`, 'success'))
//     }
//   }

//   const handleRemove = (blog) => {
//     const ownerName = blog.user?.name || blog.user?.username || 'Unknown Author'
//     if (window.confirm(`Remove blog ${blog.title} by ${ownerName}?`)) {
//       try {
//         dispatch(removeBlog(blog.id))
//         dispatch(notify(`Successfully removed blog: ${blog.title}`, 'success'))
//       } catch {
//         dispatch(notify('Failed to delete the blog.', 'failure'))
//       }
//     }
//   }

//   // LOGIN VIEW
//   if (user === null) {
//     return (
//       <div>
//         <Notification />
//         <h2>Log in to application</h2>
//         <form onSubmit={handleLogin}>
//           <div>
//             username
//             <input
//               type="text"
//               value={username}
//               name="Username"
//               onChange={({ target }) => setUsername(target.value)}
//             />
//           </div>
//           <div>
//             password
//             <input
//               type="password"
//               value={password}
//               name="Password"
//               onChange={({ target }) => setPassword(target.value)}
//             />
//           </div>
//           <button type="submit">login</button>
//         </form>

//         {blogs.length > 0 && <h3>Available Blogs</h3>}
//         {/* We map over 'blogs' which is already sorted by the selector above */}
//         {blogs.map((blog) => (
//           <Blog key={blog.id} blog={blog} />
//         ))}
//       </div>
//     )
//   }

//   // LOGGED-IN VIEW
//   return (
//     <div>
//       <Notification />
//       <h2>blogs</h2>
//       <p>
//         {user.name} logged in <button onClick={handleLogout}>logout</button>
//       </p>

//       <Togglable buttonLabel="create new blog" ref={blogFormRef}>
//         <BlogForm createBlog={handleCreateNewBlog} authorName={user.name} />
//       </Togglable>

//       {/* Map over sorted 'blogs' from Redux */}
//       {blogs.map((blog) => (
//         <Blog
//           key={blog.id}
//           blog={blog}
//           handleLike={() => handleLike(blog.id)} // Pass as arrow function
//           handleRemove={() => handleRemove(blog)} // Pass as arrow function
//           currentUser={user}
//         />
//       ))}
//     </div>
//   )
// }

// export default App
import { useState, useEffect, useRef } from 'react' // React hooks for state, lifecycle, and refs.
import { useDispatch, useSelector } from 'react-redux' // Redux hooks for dispatching actions and selecting state.

import {
  initializeBlogs,
  createBlog,
  likeBlog,
  removeBlog,
} from './reducers/blogReducer' // Blog-related Redux async actions.

import { initializeUser, setUser, clearUser } from './reducers/userReducer' // User-related Redux actions.

import { notify } from './reducers/notificationReducer' // Import notification thunk.

import Blog from './components/Blog' // Import UI components.
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs' // Import backend service modules
import loginService from './services/login'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user) // Read logged-in user from Redux store

  // Blogs from Redux, sorted by likes (descending)
  // const blogs = useSelector((state) => {
  //   const blogList = state.blogs || []
  //   return [...blogList].sort((a, b) => (b.likes || 0) - (a.likes || 0))
  // })
  const blogs = useSelector((state) => state.blogs) // Read blogs array from Redux store. Do not sort her. Insteadas sort on render.

  // const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  const [username, setUsername] = useState('') // Local state, only for login form input fields.
  const [password, setPassword] = useState('')

  const blogFormRef = useRef() // Ref used to toggle visibility of BlogForm.

  useEffect(() => {
    // Fetch blogs from backend when component first mounts.
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    // Fetch logged-in user from localStorage.
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (event) => {
    // Handle login form submission.
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({ username, password }) // Authenticate user.

      window.localStorage.setItem(
        // Persist user in browser storage.
        'loggedBloglistUser',
        JSON.stringify(loggedInUser)
      )

      blogService.setToken(loggedInUser.token) // Set auth token for blog API requests.

      dispatch(setUser(loggedInUser)) // Store user in Redux.

      setUsername('') // Clear form inputs.
      setPassword('')

      dispatch(notify(`Welcome, ${loggedInUser.name}!`, 'success')) // Show success notification.
    } catch (exception) {
      const errorMessage = // Extract backend error or fallback message.
        exception.response?.data?.error || 'wrong username or password'
      dispatch(notify(errorMessage, 'failure')) // Show failure notification
    }
  }

  const handleLogout = () => {
    // Handle logout.
    window.localStorage.removeItem('loggedBloglistUser') // Clear persisted user.
    blogService.setToken(null) // Remove auth token.
    dispatch(clearUser()) // Clear Redux user state.
  }

  const handleCreateNewBlog = async (blogObject) => {
    // Create a new blog.
    dispatch(createBlog(blogObject)) // Dispatch async thunk to backend + Redux.
    blogFormRef.current.toggleVisibility() // Toggle away from the blogForm hiding its visibility.
    dispatch(
      notify(`a new blog ${blogObject.title} by ${user.name} added`, 'success') // Show success notification.
    )
  }

  const handleLike = (blogId) => {
    // Handle liking a blog.
    const blogToLike = blogs.find((b) => b.id === blogId) // Find blog in Redux state
    if (blogToLike) {
      // If blogToLike dispatch like thunk
      dispatch(likeBlog(blogToLike))
    }
  }

  const handleRemove = (blog) => {
    // Handle removing a blog
    const ownerName = blog.user?.name || blog.user?.username || 'Unknown Author' // Confirm author name, if known.
    if (window.confirm(`Remove blog ${blog.title} by ${ownerName}?`)) {
      // Confirm deletion
      dispatch(removeBlog(blog.id)) // Dispatch delete thunk
      dispatch(
        notify(`Successfully removed blog: ${blog.title}`, 'success') // Success message required by Playwright test.
      )
    }
  }

  // Login View
  if (user === null) {
    return (
      <div>
        <Notification />
        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>

        {blogs.map(
          (
            blog // Blogs rendered even when logged out.
          ) => (
            <Blog key={blog.id} blog={blog} />
          )
        )}
      </div>
    )
  }

  // Logged In View
  return (
    <div>
      <Notification />
      <h2>blogs</h2>

      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateNewBlog} authorName={user.name} />
      </Togglable>

      {blogs.map(
        (
          blog // Blogs rendered in Redux order
        ) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={() => handleLike(blog.id)}
            handleRemove={() => handleRemove(blog)}
            currentUser={user}
          />
        )
      )}
    </div>
  )
}

export default App
