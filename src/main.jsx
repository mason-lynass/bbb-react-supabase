import React from 'react'
import ReactDOM from 'react-dom/client'
import OldApp from './OldApp.jsx'
import NewApp from './NewApp.jsx'
import './CSS/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <NewApp />
  </React.StrictMode>,
)
