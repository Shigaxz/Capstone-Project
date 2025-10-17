import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './vistas/App'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css'
import Reservas from './vistas/Reservas/Reservas'; 
import Memorias from './vistas/Memorias/Memorias';
import SeleccionHorario from './vistas/Reservas/SeleccionHorario';
import ScrollToTop from './componentes/ScrollToTop';
import PruebaNomas from './vistas/Reservas/Formulario';
import MemoriaDetalle from './vistas/Memorias/MemoriaDetalle';
import Principal from './vistas/Principal/Principal';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/Memorias" element={<Memorias />} />
        <Route path="/Memorias/:id" element={<MemoriaDetalle />} />
        <Route path="/seleccionhorario" element={<SeleccionHorario />} />

        <Route path="/formulario" element={<PruebaNomas />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
