import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Vistas/App'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css'
import Reservas from './Vistas/Reservas/Reservas'; 
import Memorias from './Vistas/Memorias/Memorias';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/Memorias" element={<Memorias />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
