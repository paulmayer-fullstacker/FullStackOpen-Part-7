// src/main.jsx:
import ReactDOM from 'react-dom/client' // Import ReactDOM's root API.
import { Provider } from 'react-redux' // Import Provider so the store is available to all components.
import store from './store' // Import store.
import App from './App' // Import the root App component.
import './index.css' // Import global CSS styles.

ReactDOM.createRoot(document.getElementById('root')).render(
  // Create the React root and render the application
  <Provider store={store}>
    {' '}
    {/* // Provider injects the Redux store into React's context */}
    <App />{' '}
    {/* App wrapped in Provider, makes store available to every component of the App */}
  </Provider>
)
