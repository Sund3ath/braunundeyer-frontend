import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import './App.css'
import './styles/index.css'
import './cms/styles/admin.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
