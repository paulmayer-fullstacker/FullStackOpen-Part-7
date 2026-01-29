// src/components/Togglable.jsx:
// Togglable is a reusable wrapper that lets us show or hide content with a button click.
import { useState, useImperativeHandle, forwardRef } from 'react' // Also import forwardRef
import { StyledButton } from './GlobalStyling' // Import the shared global style
// Wrap the function in forwardRef and add 'ref' argument.
const Togglable = forwardRef((props, ref) => {
  // 'ref' is now available here
  const [visible, setVisible] = useState(false) // useState(false): by default content is hidden
  // These two lines are creating JavaScript objects that define inline CSS styles based on the current value of the visible state variable.
  // hideWhenVisible controls the “Show” button (visible only when the content is hidden, and hidden when the content is visible
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  // showWhenVisible controls the content + “Cancel” button (visible only when the content is visible).

  // Defines a function to flip the visible state between true/false.
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  // useImperativeHandle now attaches the object to the 'ref' passed from the parent.
  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div style={{ marginBottom: '10px' }}>
      {/* This section is shown ONLY when the content is hidden */}
      <div style={hideWhenVisible}>
        {/* Style makes this visible when `visible` is false. Clicking shows the hidden content */}
        <StyledButton onClick={toggleVisibility}>
          {/* Text for the button comes from parent component */}
          {props.buttonLabel}
        </StyledButton>
      </div>

      {/* This section is shown ONLY when the content is visible */}
      <div style={showWhenVisible}>
        {/* Style makes this visible when `visible` is true */}
        {props.children}
        <StyledButton
          secondary
          onClick={toggleVisibility}
          style={{ marginTop: '5px' }}
        >
          {/* Clicking hides the content again */}
          cancel
        </StyledButton>
      </div>
    </div>
  )
}) // Close forwardRef wrapper

Togglable.displayName = 'Togglable' // Add display name

export default Togglable
