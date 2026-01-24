// // src/main.jsx:
// main.jsx: entry point for the app.
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './NotificationContext'
import { UserContextProvider } from './UserContext'
import App from './App'
import './index.css'
// Create a single instance of QueryClient to manage all caching and server state.
const queryClient = new QueryClient()
//  App wraped in three providers, ensuring that any component in the tree can access Query Client, User state, and the Notification system without prop drilling.
ReactDOM.createRoot(document.getElementById('root')).render(
  // Provide the QueryClient to the whole app.
  <QueryClientProvider client={queryClient}>
    {/* Provide User state (is someone logged in?), to the whole app. */}
    <UserContextProvider>
      {/* Provide Notification state (success/error messages). */}
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </UserContextProvider>
  </QueryClientProvider>
)
