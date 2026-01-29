// src/components/GlobalStyling.js
// Styled Components. Leveraging a "prop-driven" styling pattern. Allows us to keep our components DRY (Don't Repeat Yourself),
// while still being flexible enough to handle different semantic states, via props.
import styled from 'styled-components'
// Styled Button - Used for: Form submissions, create new blog, like, remove, add comment.
// Modifiers: 'red' (danger), 'secondary' (neutral), and 'margin-top' (spacing).
export const StyledButton = styled.button`
  /* Logic: Checks props to determine background color. Default is Primary Blue. */
  background: ${(props) => {
    // Here prop is a Switch (Booleans).
    if (props.red) return '#e74c3c' // If <StyledButton red />, use Red. - Delete/Remove.
    if (props.secondary) return '#95a5a6' // If <StyledButton secondary />, use Gray. - Cancel/Neutral.
    return '#3498db' // Primary Blue. - General Action Button. Blue also signifies Action applied to ItemCard.
  }};
  color: white; // Sets text color to white for contras.
  border: none; // Removes default browser button border.
  padding: 8px 16px; // Vertical and horizontal internal spacing.
  border-radius: 4px; // Soften corners.
  cursor: pointer; // Changes cursor to hand icon on hover.
  font-weight: 600; // Makes text slightly bold.
  font-size: 0.9rem; // Standardise button text size.
  transition: filter 0.2s; // Smoothly animates the hover effect (&:hover).

  &:hover {
    filter: brightness(90%); // Darkens the button slightly when hovered
  }

  /* Logic: Dynamic margin-top. Allows manual override like mt="10px" */
  margin-top: ${(props) =>
    props.mt ||
    '0px'}; // Here prop is a Variable. Passthrough prop allows us to override the global default.
`
// Styled Input - Used for: Text input fields, cret new title and url, comments. Note: box-sizing prevents padding from breaking the width.
export const StyledInput = styled.input`
  width: 100%; // Takes up full width of its container.
  padding: 10px; // Generates internal space for text.
  margin: 8px 0; // Adds vertical spacing between inputs.
  border: 1px solid #ddd; // Light gray border.
  border-radius: 4px; // Matching the button's corner radius.
  box-sizing: border-box; // Includes padding/border in the 100% width. Prevents width overflow.
  font-size: 1rem;

  &:focus {
    outline: none; // Removes default blue browser outline.
    border-color: #3498db; // Highlights border Blue on focus.
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); // Adds a soft blue haze around the input field.
  }
`
// Item Card - Used for: List items, users, added blogs, blogs and likes. Modifiers: 'padding', 'margin', 'borderColor', and 'hoverable'.
export const ItemCard = styled.div`
  background: white;
  padding: ${(props) =>
    props.padding || '15px'}; // Logic: Custom padding or defaults to 15px.
  border-radius: 8px; // More rounded corners than buttons/inputs.
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Subtle lift from the background.
  // This line supports our margin prop. i.e.: margin="20px 0".
  margin: ${(props) =>
    props.margin ||
    '0 0 12px 0'}; // Logic: Custom margin (e.g., margin="20px 0") or defaults to bottom spacing.
  transition:               // Smoothly animate movement and background color change on hover.
    transform 0.2s,
    background 0.2s;

  border-left: 5px solid ${(props) => props.borderColor || '#3498db'}; // Logic: Sets left accent border color. Defaults to Blue if no prop provided.

  ${(
    props //
  ) =>
    props.hoverable && // Logic: Conditional block. Only applies hover effects if 'hoverable' prop exists. Blog: hoverable. User: not hoverable. */
    `
    &:hover {
      transform: translateX(5px);   // Shift card slightly to the right.
      background: #f8f9fa;        // Gray background change.
    }
    }
  `}
`
// // Styled Footer - Used for: Page copyright, links, and branding. **TBC**
// export const StyledFooter = styled.footer`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 20px;
//   font-size: 0.9rem;
// `
