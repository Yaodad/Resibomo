import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ItemsContextProvider } from './context/ItemContext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ItemsContextProvider>
        <App />
      </ItemsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
