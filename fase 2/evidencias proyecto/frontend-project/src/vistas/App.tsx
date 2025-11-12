import { Routes, Route } from "react-router-dom";
import ScrollToTop from "../componentes/ScrollToTop";
import Reservas from "../vistas/Reservas/Reservas";
import Memorias from "../vistas/Memorias/Memorias";
import SeleccionHorario from "../vistas/Reservas/SeleccionHorario";
import PruebaNomas from "../vistas/Reservas/Formulario";
import MemoriaDetalle from "../vistas/Memorias/MemoriaDetalle";
import Principal from "../vistas/Principal/Principal";
import LoginPage from "../vistas/Admin/LoginPage";
import AdminLayout from "../vistas/Admin/AdminLayout";
import LocationManager from "../vistas/Admin/LocationManager";
import SpaceManager from "../vistas/Admin/SpaceManager";
import MemoryManager from "../vistas/Admin/MemoryManager";
import ReservationManager from "../vistas/Admin/ReservationManager";
import ProtectedRoute from "../componentes/ProtectedRoute";
import SpaceSelectionPage from "./Reservas/SpaceSelectionPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/reservas/:id" element={<SpaceSelectionPage />} />
        <Route path="/memorias" element={<Memorias />} />
        <Route path="/Memorias/:id" element={<MemoriaDetalle />} />
        <Route
          path="/reserva/:idLocation/horario/:idSpace"
          element={<SeleccionHorario />}
        />
        <Route path="/formulario" element={<PruebaNomas />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route path="locations" element={<LocationManager />} />
            <Route path="spaces" element={<SpaceManager />} />
            <Route path="memories" element={<MemoryManager />} />
            <Route path="reservations" element={<ReservationManager />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
