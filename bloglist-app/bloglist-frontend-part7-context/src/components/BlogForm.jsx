// src/components/BlogForm.jsx
// Presentational components that receive data and functions (like createBlog) as props.
import { useState } from 'react'
import styled from 'styled-components' // Import styling component
import { StyledButton, StyledInput } from './GlobalStyling'

const FormContainer = styled.div`
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 25px;
  border: 1px solid #e9ecef;
`

const BlogForm = ({ createBlog, authorName }) => {
  // Local state for form inputs.
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    // Call the parent handler with the new blog object.
    createBlog({ title: newTitle, author: authorName, url: newUrl })
    // Clear the form fields after submission
    setNewTitle('')
    setNewUrl('')
    // Note: newAuthor remains fixed via the prop.
  }

  return (
    <FormContainer>
      <h3 style={{ marginTop: 0 }}>create new</h3>
      {/* Form element: when submitted, calls the addBlog function */}
      <form onSubmit={addBlog}>
        <div>
          {/* Use labels to enhance accessability, and assist auto testing (screen.getByLabelText). */}
          <label>title:</label>
          <StyledInput
            value={newTitle} // The current title value stored in component state.
            onChange={({ target }) => setNewTitle(target.value)} // When the user types in the input, update the newTitle state with the new value.
            placeholder="enter blog title..."
          />
        </div>
        {/* Author input field (read-only, filled from the logged-in user's data) */}
        <div>
          <label>author:</label>
          <StyledInput
            value={authorName} // Shows the author's name (logged-in user's name) from state.
            readOnly // Author field is read-only
            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
          />
        </div>
        <div>
          {/* URL input field */}
          <label>url:</label>
          <StyledInput
            value={newUrl} // Current URL stored in state
            onChange={({ target }) => setNewUrl(target.value)} // When typing, update newUrl state
            placeholder="enter document URL..."
          />
        </div>
        <StyledButton type="submit" mt="10px">
          {' '}
          {/* The 'create' button triggers the submission */}
          create
        </StyledButton>{' '}
        {/* Triggers form submission → calls addBlog */}
      </form>
    </FormContainer>
  )
}

export default BlogForm
