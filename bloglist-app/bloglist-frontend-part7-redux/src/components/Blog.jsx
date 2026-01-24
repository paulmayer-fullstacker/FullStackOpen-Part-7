// // src/components/Blog.jsx:

import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, currentUser }) => {
  const [visible, setVisible] = useState(false) // Local UI state: collapsed vs expanded

  const toggleVisibility = () => setVisible(!visible) // Toggle expanded view

  const authorName = blog.user?.name || blog.user?.username || 'Unknown Author' // Determine author name if known

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
      <span className="blog-title-author">
        {blog.title} by {authorName}
      </span>
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>

      {visible && ( // Only show details (including like button) if expanded.
        <>
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            likes {blog.likes}
            {handleLike && (
              <button onClick={() => handleLike(blog.id)}>like</button>
            )}
          </div>
          <div>{authorName}</div>
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
