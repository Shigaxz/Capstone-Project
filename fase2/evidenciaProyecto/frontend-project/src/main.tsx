import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './vistas/App'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css'
import Reservas from './vistas/Reservas/Reservas'; 
import Memorias from './vistas/Memorias/Memorias';
import SeleccionHorario from './vistas/Reservas/SeleccionHorario';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/Memorias" element={<Memorias />} />
        <Route path="/seleccionhorario" element={<SeleccionHorario />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
