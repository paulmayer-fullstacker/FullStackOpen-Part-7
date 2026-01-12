/*  This project is a React application that demonstrates how to use Custom Hooks to manage form state and asynchronous data fetching.
    It allows a user to type a country name into an input field and, upon clicking "find," fetches data
    From the University of Helsinki's REST Countries API to display details like the capital, population, and flag.
*/

// index.jsx:
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
