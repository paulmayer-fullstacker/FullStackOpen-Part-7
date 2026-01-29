// src/App.jsx:
// App.jsx (controller): Uses React Query (useQuery and useMutation) to keep the UI in sync with the database.
// When a user likes a blog, React Query sends the request and then automatically updates the cache or "invalidates" the data to trigger a re-fetch.

import { useState, useEffect, useRef } from 'react' // React hooks for local state, side effects, and DOM/component references.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // React Query hooks for fetching, mutating, and accessing the global cache.
import { useUserValue, useUserDispatch } from './UserContext' // Custom context hooks to access/modify global User state.
import { useNotify } from './NotificationContext' // Custom hook to trigger temporary notification messages.
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom' // Import Routing components. React Router: Logic that allows the URL to change (e.g., /users) without the page refreshing.
import styled from 'styled-components' // Import styling component. Allows writing CSS directly inside this JavaScript file
// UI Components:
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Users from './components/Users' // Import the Users view component,
import User from './components/User' // and the User view component.
import BlogView from './components/BlogView' // Import the detailed Blog view component.
// Import API services for backend communication.
import blogService from './services/blogs'
import loginService from './services/login'

// Styled Components Definition:
// This styling is specifice to this file, not globally reusable components (as in GlobalStyling.js).
// Page: Main wrapper for the whole app. min-height: 100vh ensures the background covers the whole screen.
const Page = styled.div`
  padding: 1em;
  background: #fdfdfd;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`
// NavBar: Header bar. display: flex and align-items:center keep links and user info in a line.
const NavBar = styled.nav`
  background: #34495e;
  padding: 1em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  /* Styling the Links inside the Nav */
  & a {
    color: white;
    margin-right: 15px;
    text-decoration: none;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }
  /* Styling the user span and button inside Nav */
  & span {
    color: #ecf0f1;
    margin-left: auto; /* Pushes user info to the right */
    font-size: 0.9em;
  }
`

const App = () => {
  const queryClient = useQueryClient() // Access the query client for manual cache updates.
  const notify = useNotify() // Custom hook to trigger notifications.
  const user = useUserValue() // Get the current user from Context.
  const userDispatch = useUserDispatch() // Get the dispatcher to change user state.
  // Local state for the login form inputs:
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef() // Reference to the Togglable component to control blogForm visibility.

  // Fetch Blogs: Automatically fetche data when component mounts.
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'], // Unique key for this data in the cache.
    queryFn: blogService.getAll, // The function that actually calls the API.
    retry: 1, // Only retry once on failure.
  })

  // Mutations: Logic for replacing (not changing), data on the server.
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    // If server responds to update with 'success'.
    onSuccess: (newBlog) => {
      // Get the current list of blogs from the local cache.
      const currentBlogs = queryClient.getQueryData(['blogs'])
      // Manual Cache Update: Using setQueryData to manually switch the new blog to the existing cache,
      // without a second network request to fetch the whole list. Thus, reducing network TFC and improving performace.
      queryClient.setQueryData(['blogs'], currentBlogs.concat(newBlog))
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`) //
    },
    onError: (error) => {
      // Extract the specific error message from the backend response if it exists.
      const errorMessage =
        error.response?.data?.error || 'Failed to create blog'
      notify(errorMessage, 'failure')
    },
  })
  // Mutation for updating (liking) a blog.
  const updateBlogMutation = useMutation({
    mutationFn: (blog) => blogService.update(blog.id, blog),
    // Invalidation: Tell React Query 'blogs' data is invalid, thus forcing an automatic re-fetch.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  })

  // Mutation for adding anonymous blog comments.
  const commentMutation = useMutation({
    // mutationFn takes an object containing the blog ID and the comment string.
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: (updatedBlog) => {
      // Invalidate the 'blogs' query to trigger a background re-fetch, thus ensuring the detailed view gets the updated comments array from the server.
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`added comment: "${updatedBlog.comments.slice(-1)}"`) // Notify sucess notification. Extracts last comment added to the list [-1] append to 'added comment', and displays it inside the notification block.
    },
    onError: (error) => {
      notify(error.response?.data?.error || 'Failed to add comment', 'failure')
    },
  })

  // Mutation for deleting a blog.
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  })

  // Side Effect: Run once on mount. When the app starts, check if the user "Logged In" previously (saved in browser storage).
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      // if a user session exists in the browser's storage, make user the logged in user.
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user }) // Log the user back in.
      blogService.setToken(user.token) // Set the API authorization token.
    }
  }, [userDispatch]) // Dependencies: userDispatch is stable, so this runs once.

  // Handlers:
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      // Persist user to local storage so they stay logged in, after page refresh.
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
      setUsername('')
      setPassword('')
      notify(`Welcome, ${user.name}!`)
    } catch {
      notify('invalid username or password', 'failure')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser') // Clear local storage.
    userDispatch({ type: 'CLEAR_USER' }) // Clear context state.
  }

  const handleCreateNewBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject) // Trigger the creation mutation.
    blogFormRef.current.toggleVisibility() // Use the ref to toggle away from (hide) the 'Create' form.
    // notify(`a new blog ${blogObject.title} by ${blogObject.author} added`)   // Moved to newBlogMutation.
  }

  const handleLike = (blog) => {
    // Send the full blog object but increment likes and ensure user field is just an ID.
    updateBlogMutation.mutate({
      ...blog, // Unpack and copy blog object.
      likes: blog.likes + 1, // with likes incremented.
      user: blog.user.id, //|| blog.user, // and ensuring user field is just an ID.
    })
  }

  const handleComment = (id, comment) => {
    commentMutation.mutate({ id, comment })
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      deleteBlogMutation.mutate(blog.id)
      notify(`Successfully removed blog: ${blog.title}`)
    }
  }

  // Conditional Rendering Logic:
  // If useQuery is still waiting for the first response, show loading.
  if (isLoading) return <div>Loading...</div>
  // Logic to sort blogs by like count (descending) before rendering.
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (!user) {
    // Login view: Rendered if no user is found in context (no user logged in).
    return (
      <Page>
        <Notification />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username{' '}
            <input
              name="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            password{' '}
            <input
              type="password"
              name="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </Page>
    )
  }

  return (
    // Main App view: Rendered if user is logged in. This is wrapped in <Router> allowing us to switch between blog list and user views.
    <Router>
      <Page>
        <Notification />
        {/* Navigation Menu: Links to navigate between the blogs view and the users view. */}
        <NavBar>
          <Link to="/">blogs</Link>
          <Link to="/users">users</Link>
          <span>
            {user.name} logged in
            <button style={{ marginLeft: '10px' }} onClick={handleLogout}>
              logout
            </button>
          </span>
        </NavBar>

        <h2>blogs</h2>

        {/* Routes Container: Routes will render only one child component depending on the current URL. */}
        <Routes>
          {/* Path for individual user view, identified by id (/users/:id).  */}
          <Route path="/users/:id" element={<User />} />
          {/* Path for general users view (list of all users). */}
          <Route path="/users" element={<Users />} />
          {/* Path for detailed individual blog view */}
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={blogs}
                handleLike={handleLike}
                handleRemove={handleRemove}
                handleComment={handleComment} // Pass handleComment to the individual blog view.
                currentUser={user}
              />
            }
          />
          {/* Default path for blogs view (list of all blogs [compressed view]). */}
          <Route
            path="/" // Blogs page: Create Btn and List of Blogs.
            element={
              <div>
                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <BlogForm
                    createBlog={handleCreateNewBlog}
                    authorName={user.name}
                  />
                </Togglable>
                {sortedBlogs.map((blog) => (
                  <Blog key={blog.id} blog={blog} />
                ))}
              </div>
            }
          />
        </Routes>
      </Page>
    </Router>
  )
}

export default App
