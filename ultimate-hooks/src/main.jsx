// src/main.jsx:
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(    // Create the root element and render the app.
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
/* Why use strict mode:
     Development-only tool. It intentionally runs our useEffect and component logic twice, to help you find "side effect" bugs.
     If the code breaks because it ran twice (e.g., creating two notes or persons instead of one), then our code is not clean enough or resilient.
     It can help to catch bugs, memory leaks, and outdated code patterns.
*/