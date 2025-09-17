import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/inter';
import '@fontsource/lexend/index.css';
import "react-image-crop/dist/ReactCrop.css";



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>  
  </StrictMode>,
)
