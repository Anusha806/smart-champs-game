import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import GameProvider from './context/GameContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameProvider>

      <Toaster
        position="top-right"
        toastOptions={{
          style:{
            background:"#1E293B",
            color:"#fff",
            border:"1px solid #38BDF8"
          }
        }}
      />

      <App />

    </GameProvider>
  </StrictMode>,
)