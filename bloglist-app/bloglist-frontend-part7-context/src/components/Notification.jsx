// src/components/Notification.jsx
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  // Use our Custom Hok (Helper) from NotificationContext.jsx to get the current notification object.
  const notification = useNotificationValue()
  // Guard Clause: If notification null (default state), we return null. Remember, in React, returning null means 'render nothing'.
  if (!notification) return null

  return (
    // Dynamic Class Naming: If type == 'success', the class becomes 'notification success'. If type == 'failure', the class becomes 'notification failure'. This allows us to style successes in green and failures in red in index.css.
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  )
}
export default Notification
