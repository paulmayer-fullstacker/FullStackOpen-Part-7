// src/main.jsx:
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from "react-router-dom"  // Import the router context provider

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
     <App />
  </Router>
 )  // Wrap the entire App <Router> (BrowserRouter), thus allowing any component inside App to use routing hooks like useNavigate or useMatch.