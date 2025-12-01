import React, { useState, useEffect, useCallback } from "react";
import {
  getHistoryReservations,
  deleteReservation,
} from "../../services/reservationsApiServices";
import type { Reservation } from "../../interfaces/reservations";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Alert from "../../vistas/Admin/Alert";
import ConfirmationModal from "../../vistas/ConfirmationModal";

const ReservationsHistory: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  type AlertType = "success" | "error" | "warning" | "info";
  const [alertInfo, setAlertInfo] = useState({
    type: "info" as AlertType,
    title: "",
    message: "",
    isVisible: false,
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setAlertInfo({ ...alertInfo, isVisible: false });
    try {
      const data = await getHistoryReservations();
      data.sort(
        (a, b) =>
          parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime()
      );
      setReservations(data);
    } catch (err: any) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: err.message || "Error al cargar historial",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    setAlertInfo({ ...alertInfo, isVisible: false });

    try {
      await deleteReservation(deletingId);
      setAlertInfo({ type: 'success', title: 'Éxito', message: 'Reserva eliminada.', isVisible: true });
      fetchData();
    } catch (err: any) {
      setAlertInfo({ type: 'error', title: 'Error', message: err.message || 'Error al eliminar', isVisible: true });
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const formatDateTime = (isoString: string) =>
    format(parseISO(isoString), "dd MMM, HH:mm", { locale: es });
  const getSpaceName = (espacioId: Reservation["espacioId"]) =>
    typeof espacioId === "string"
      ? espacioId
      : espacioId?.name || "Espacio Desconocido";

  return (
    <div>
      <Alert
        {...alertInfo}
        onClose={() => setAlertInfo({ ...alertInfo, isVisible: false })}
      />
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={thStyle}>Estado</th>
              <th className={thStyle}>Espacio</th>
              <th className={thStyle}>Email</th>
              <th className={thStyle}>Inicio</th>
              <th className={thStyle}>Fin</th>
              <th className={`${thStyle} text-right`}>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className={tdCenter}>
                  Cargando historial...
                </td>
              </tr>
            ) : reservations.length > 0 ? (
              reservations.map((res) => (
                <tr
                  key={res._id}
                  className={res.isApproved === false ? "bg-red-50/50" : ""}
                >
                  <td className={tdStyle}>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        res.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {res.isApproved ? "Aprobada" : "Rechazada"}
                    </span>
                  </td>
                  <td className={`${tdStyle} font-medium text-gray-900`}>
                    {getSpaceName(res.espacioId)}
                  </td>
                  <td className={tdStyle}>{res.email}</td>
                  <td className={tdStyle}>{formatDateTime(res.startTime)}</td>
                  <td className={tdStyle}>{formatDateTime(res.endTime)}</td>
                  <td className={`${tdStyle} text-right space-x-2`}>
                    <button
                      onClick={() => handleDelete(res._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={tdCenter}>
                  No hay historial de reservas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar esta reserva permanentemente? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        loading={isDeleting}
      />
    </div>
  );
};

const thStyle =
  "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider";
const tdStyle = "px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center";
const tdCenter = "text-center py-4 text-gray-500";

export default ReservationsHistory;
