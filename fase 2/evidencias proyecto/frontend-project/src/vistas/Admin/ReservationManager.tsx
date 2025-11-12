import React, { useState } from 'react';
import type { CreateReservationData } from "../../interfaces/reservations";
import { createReservation } from "../../services/reservationsApiServices";
import Alert from "./Alert";
import ReservationFormModal from "../../componentes/componentes_admin/ReservationFormModal";
import ReservationsPending from '../../componentes/componentes_admin/ReservationsPending';
import ReservationsHistory from '../../componentes/componentes_admin/ReservationsHistory';
import ReservationsAll from '../../componentes/componentes_admin/ReservationsAll';

const ReservationManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<"pending" | "history" | "all">("pending");
  
  // El manager se sigue encargando de CREAR, ya que el botón está en el layout
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  type AlertType = "success" | "error" | "warning" | "info";
    const [alertInfo, setAlertInfo] = useState({
      type: "info" as AlertType,
      title: "",
      message: "",
      isVisible: false,
    });
  // Estado para notificar a los hijos que recarguen
  const [dataVersion, setDataVersion] = useState(0); 
  const refreshData = () => setDataVersion(v => v + 1);

  const handleAddReservation = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSubmitCreateForm = async (data: CreateReservationData) => {
    try {
      await createReservation(data);
      setAlertInfo({
        type: "success",
        title: "Éxito",
        message: "Reserva creada con éxito (quedará pendiente de aprobación).",
        isVisible: true,
      });
      refreshData();
    } catch (err: any) {
      // Pasa el error al modal
      throw err; 
    }
  };

  // Función para renderizar el componente de la pestaña activa
  const renderView = () => {
    switch(viewMode) {
      case 'pending':
        return <ReservationsPending onReservationCreated={dataVersion} />;
      case 'history':
        return <ReservationsHistory />;
      case 'all':
        return <ReservationsAll />;
      default:
        return <ReservationsPending onReservationCreated={dataVersion} />;
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestionar Reservas</h1>
        <button
          onClick={handleAddReservation}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
        >
          + Crear Reserva
        </button>
      </div>

      <div className="mb-4">
        <Alert
          type={alertInfo.type}
          title={alertInfo.title}
          message={alertInfo.message}
          isVisible={alertInfo.isVisible}
          onClose={() => setAlertInfo({ ...alertInfo, isVisible: false })}
        />
      </div>

      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setViewMode("pending")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === "pending"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === "history"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Historial
          </button>
           <button
            onClick={() => setViewMode("all")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Todas
          </button>
        </nav>
      </div>
      
      <div>
        {renderView()}
      </div>

      <ReservationFormModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitCreateForm}
      />
    </div>
  );
};

export default ReservationManager;