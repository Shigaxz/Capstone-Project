import React, { useState, useEffect, useCallback } from "react";
import {
  getPendingReservations,
  getHistoryReservations,
  approveReservation,
  rejectReservation,
  createReservation,
} from "../../services/reservationsApiServices";
import type { Reservation, CreateReservationData } from "../../interfaces/reservations";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import ReservationFormModal from "../../componentes/componentes_admin/ReservationFormModal";

const ReservationManager: React.FC = () => {
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>(
    []
  );
  const [historyReservations, setHistoryReservations] = useState<Reservation[]>(
    []
  );
  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"pending" | "history">("pending");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Función para cargar datos (reutilizable)
  const fetchData = useCallback(async () => {
    setError(null);
    if (viewMode === "pending") {
      setLoadingPending(true);
      try {
        const data = await getPendingReservations();
        setPendingReservations(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar pendientes");
      } finally {
        setLoadingPending(false);
      }
    } else {
      setLoadingHistory(true);
      try {
        const data = await getHistoryReservations();
        // Ordena el historial, por ejemplo, por fecha más reciente primero
        data.sort(
          (a, b) =>
            parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime()
        );
        setHistoryReservations(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar historial");
      } finally {
        setLoadingHistory(false);
      }
    }
  }, [viewMode]); // Depende de viewMode

  // Carga inicial y cuando cambia viewMode
  useEffect(() => {
    fetchData();
  }, [fetchData, viewMode]);

  // --- Manejadores de Acciones ---
  const handleApprove = async (id: string) => {
    try {
      await approveReservation(id);
      alert("Reserva aprobada con éxito. Se ha notificado al usuario.");
      fetchData(); // Recarga la lista actual (pendientes desaparecerá)
    } catch (err: any) {
      setError(err.message || "Error al aprobar");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReservation(id);
      alert("Reserva rechazada con éxito. Se ha notificado al usuario.");
      fetchData(); // Recarga la lista actual (pendientes desaparecerá)
    } catch (err: any) {
      setError(err.message || "Error al rechazar");
    }
  };

  const handleAddReservation = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSubmitCreateForm = async (data: CreateReservationData) => {
    try {
      await createReservation(data);
      alert("Reserva creada con éxito (quedará pendiente de aprobación).");
      fetchData(); // Recarga la lista de pendientes
    } catch (err: any) {
      throw err; // Pasa el error al modal
    }
  };

  // Helper para formatear fecha y hora
  const formatDateTime = (isoString: string) => {
    try {
      // Ejemplo: "20 oct, 14:00"
      return format(parseISO(isoString), "dd MMM, HH:mm", { locale: es });
    } catch {
      return "Fecha inválida";
    }
  };

  // Helper para mostrar el nombre del espacio (si viene poblado)
  const getSpaceName = (espacioId: Reservation["espacioId"]): string => {
    if (typeof espacioId === "string") {
      return espacioId;
    }
    return espacioId?.name || "Espacio Desconocido";
  };

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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setViewMode("pending")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              viewMode === "pending"
                ? "border-blue-500 text-blue-600" // Mantenemos estilo de pestaña activa
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pendientes ({pendingReservations.length})
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
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {viewMode === "pending" && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espacio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingPending ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Cargando pendientes...
                  </td>
                </tr>
              ) : pendingReservations.length > 0 ? (
                pendingReservations.map((res) => (
                  <tr key={res._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getSpaceName(res.espacioId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {res.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(res.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(res.endTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleApprove(res._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(res._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No hay reservas pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {viewMode === "history" && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espacio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingHistory ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Cargando historial...
                  </td>
                </tr>
              ) : historyReservations.length > 0 ? (
                historyReservations.map((res) => (
                  <tr
                    key={res._id}
                    className={res.isApproved === false ? "bg-red-50/50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Mantenemos el badge de estado */}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          res.isApproved === true
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {res.isApproved === true ? "Aprobada" : "Rechazada"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getSpaceName(res.espacioId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {res.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(res.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(res.endTime)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No hay historial de reservas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
