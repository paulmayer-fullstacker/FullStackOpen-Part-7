// // src/components/Blog.jsx:
// Presentational component that receive data and functions (like handleLike) as props.
import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, currentUser }) => {
  const [visible, setVisible] = useState(false) // Local UI state: collapsed vs expanded

  const toggleVisibility = () => setVisible(!visible) // Toggle expanded view by flipping the boolean state.

  const authorName = blog.user?.name || blog.user?.username || 'Unknown Author' // Determine author name if known
  //  ^  // Optional Chaining: Use ?. because 'blog.user' might be undefined if the data is still loading or poorly formatted. This prevents the app from crashing.

  const isOwner = // Check if logged-in user is the blog creator/owner
    blog.user &&
    currentUser &&
    (blog.user.id === currentUser.id ||
      blog.user.username === currentUser.username)
  // Inline styling for blog container
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className="blog-item">
      {/* Header: Always visible */}
      <span className="blog-title-author">
        {blog.title} by {authorName}
      </span>
      {/* Toggle View Button: Changes text dynamically based on 'visible' state */}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      {/* Conditional Rendering: Using the && operator. If 'visible' is false, React ignores everything inside the parentheses. */}
      {visible && ( // Only show details (including like button) if expanded (visible).
        <>
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            likes {blog.likes}
            {/* Action Prop: Call the function passed down from App.jsx */}
            {handleLike && (
              <button onClick={() => handleLike(blog.id)}>like</button>
            )}
          </div>
          <div>{authorName}</div>
          {/* Owner Only Action: Remove button only renders if 'isOwner' is true */}
          {isOwner &&
            handleRemove && ( // Remove button only visible to blog owner.
              <button onClick={() => handleRemove(blog)}>remove</button>
            )}
        </>
      )}
    </div>
  )
}

export default Blog
