import React from 'react'
import ReactDOM from 'react-dom/client'

// Import all components and styles
import '../styles/styles.css'
import '../styles/tokens.css'
import './scripts/data.js'
import './scripts/storage.js'
import App from './components/app'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
