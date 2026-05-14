import React from 'react'
import ReactDOM from 'react-dom/client'

// Import styles
import './styles/styles.css'
import './styles/tokens.css'

// Import App component (which imports all dependencies)
import App from './components/app.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
