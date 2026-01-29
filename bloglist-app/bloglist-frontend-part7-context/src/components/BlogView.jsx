// src/componets/BlogView.jsx:
import { useState } from 'react' // Import useState for local (add comment) form management.
import { useParams, useNavigate } from 'react-router-dom'
import { StyledButton, StyledInput, ItemCard } from './GlobalStyling' // Imported shared global styles

const BlogView = ({
  blogs,
  handleLike,
  handleRemove,
  handleComment,
  currentUser,
}) => {
  const { id } = useParams() // Extract the ID from the URL.
  const navigate = useNavigate() // To redirect if a blog is deleted.

  const [commentText, setCommentText] = useState('') // Local state for comment input text.

  // Find the specific blog from the list passed as props.
  const blog = blogs.find((b) => b.id === id)

  // Safety check if data hasn't loaded or blog doesn't exist.
  if (!blog) return null

  const authorName = blog.user?.name || blog.user?.username || 'Unknown Author'

  const isOwner =
    blog.user &&
    currentUser &&
    (blog.user.id === currentUser.id ||
      blog.user.username === currentUser.username)

  const onAddComment = (event) => {
    event.preventDefault()
    if (commentText.trim()) {
      handleComment(blog.id, commentText) // If there is a comment, trim it then handle by triggering mutation.
      setCommentText('') // Reset input field after submission.
    }
  }

  const onRemove = () => {
    handleRemove(blog)
    navigate('/') // Go back to main list after removal
  }

  return (
    <ItemCard padding="2rem">
      <h2 style={{ marginBottom: '0.5rem' }}>{blog.title}</h2>
      <a
        href={blog.url}
        target="_blank"
        rel="noreferrer"
        style={{
          color: '#3498db',
          display: 'inline-block',
          marginBottom: '10px',
        }} //{/* display: inline-block ensures link does not swallow vertical space */}
      >
        {blog.url}
      </a>

      <ItemCard
        borderColor="#bdc3c7"
        margin="20px 0"
        padding="12px"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          background: '#fdfdfd',
          width: 'fit-content', // Keeps the likes card tight to its content
        }}
      >
        <span>
          <strong>{blog.likes}</strong> likes
        </span>
        <StyledButton small onClick={() => handleLike(blog)}>
          like
        </StyledButton>
      </ItemCard>

      <p>
        added by <strong>{authorName}</strong>
      </p>

      {isOwner && (
        <StyledButton red onClick={onRemove}>
          remove
        </StyledButton>
      )}

      <hr style={{ margin: '30px 0', border: '0.5px solid #eee' }} />
      {/* Comments Display Section */}
      <h3>comments</h3>
      {/* Comment Input Form */}
      <form onSubmit={onAddComment}>
        {/* Used shared StyledInput with specific width prop */}
        <StyledInput
          width="250px"
          margin="0 10px 0 0"
          type="text"
          value={commentText}
          onChange={({ target }) => setCommentText(target.value)}
          placeholder="write your comment here..."
        />
        <StyledButton type="submit">add comment</StyledButton>
      </form>

      <ul style={{ marginTop: '20px', lineHeight: '1.6' }}>
        {blog.comments &&
          // If there are blog comments, map over the comments array. Use the array index as key, since comments are simply anonymous strings.
          blog.comments.map((comment, index) => <li key={index}>{comment}</li>)}
      </ul>
    </ItemCard>
  )
}

export default BlogView
