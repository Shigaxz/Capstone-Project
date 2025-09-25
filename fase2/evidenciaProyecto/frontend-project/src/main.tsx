import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './vistas/App'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css'
import Reservas from './vistas/Reservas'; // Import the Reservas component

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
