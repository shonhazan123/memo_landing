import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Add error handling for Cursor browser
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason)
})

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (error) {
  console.error('Failed to render app:', error)
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Error Loading App</h1>
      <p>${error.message}</p>
      <p>Check console for details.</p>
    </div>
  `
}

