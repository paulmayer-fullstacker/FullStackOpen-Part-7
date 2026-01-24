// src/components/Notification.jsx

import { useSelector } from 'react-redux' // Import useSelector

const Notification = () => {
  const notification = useSelector((state) => state.notification) // Read notification state from Redux(not props).

  if (notification.message === null) {
    return null // Render nothing if no message
  }

  const className = `notification ${notification.type}` // Use the type prop to determine the CSS class
  return (
    // When type is 'success', the resulting class is "notification success". When type is 'failure', the class is "notification failure"
    <div className={className}>{notification.message}</div>
  )
}

export default Notification
