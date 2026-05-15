import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'

// Import styles
import './styles/styles.css'
import './styles/tokens.css'

// Import Layout (router between auth and app)
import Layout from './components/layout.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Layout />
    </ClerkProvider>
  </React.StrictMode>,
)
