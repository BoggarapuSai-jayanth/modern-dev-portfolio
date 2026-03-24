import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import App from './App.jsx'
import './index.css'

// The Convex URL usually comes from an environment variable
// We use a fallback so it doesn't crash during initial setup
const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://example.convex.cloud"
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexProvider>
  </React.StrictMode>,
)
