import React, { useState, useEffect, useCallback } from "react";
import {
  findReservations,
  approveReservation,
  rejectReservation,
} from "../../services/reservationsApiServices";
import { getAllSpaces } from "../../services/spacesApiServices";
import type {
  Reservation,
  FindReservationsParams,
} from "../../interfaces/reservations";
import type { Space } from "../../interfaces/spaces";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Alert from "../../vistas/Admin/Alert";
import ConfirmationModal from "../../vistas/ConfirmationModal";

// Props para que el componente padre sepa que debe recargar
interface PendingProps {
  onReservationCreated: number;
}

const ReservationsPending: React.FC<PendingProps> = ({
  onReservationCreated,
}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [spacesList, setSpacesList] = useState<Space[]>([]);
  const [filters, setFilters] = useState<FindReservationsParams>({
    isApproved: "null",
  });

  type AlertType = "success" | "error" | "warning" | "info";
  const [alertInfo, setAlertInfo] = useState({
    type: "info" as AlertType,
    title: "",
    message: "",
    isVisible: false,
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // Cargar espacios para el filtro (solo una vez)
  useEffect(() => {
    getAllSpaces().then(setSpacesList).catch(console.error);
  }, []);

  // Función de carga de datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    setAlertInfo({ ...alertInfo, isVisible: false });

    // Prepara filtros
    const queryParams: FindReservationsParams = { isApproved: "null" };
    if (filters.espacioId && filters.espacioId !== "all")
      queryParams.espacioId = filters.espacioId;
    if (filters.date) queryParams.date = filters.date;

    try {
      const data = await findReservations(queryParams);
      data.sort(
        (a, b) =>
          parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime()
      );
      setReservations(data);
    } catch (err: any) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: err.message || "Error al cargar pendientes",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]); // Recarga si los filtros cambian

  // Carga inicial, o si los filtros cambian, o si se crea una nueva reserva
  useEffect(() => {
    fetchData();
  }, [fetchData, onReservationCreated]);

  const handleApprove = async (id: string) => {
    // Oculta cualquier alerta anterior
    setAlertInfo({ ...alertInfo, isVisible: false });
    try {
      await approveReservation(id);
      // Muestra alerta de éxito
      setAlertInfo({
        type: "success",
        title: "Éxito",
        message: "Reserva aprobada con éxito. Se ha notificado al usuario.",
        isVisible: true,
      });
      fetchData();
    } catch (err: any) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: err.message || "Error al aprobar la reserva",
        isVisible: true,
      });
    }
  };

  const handleRejectRequest = (id: string) => {
    setRejectingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmReject = async () => {
    // Verifica que haya un ID guardado
    if (!rejectingId) return;

    // Pone el modal en estado de carga
    setIsRejecting(true);
    setAlertInfo({ ...alertInfo, isVisible: false });

    try {
      // Llama a la API para rechazar
      await rejectReservation(rejectingId);

      // Muestra alerta de éxito
      setAlertInfo({
        type: "success",
        title: "Éxito",
        message: "Reserva rechazada con éxito. Se ha notificado al usuario.",
        isVisible: true,
      });

      // Recarga la lista de pendientes (la reserva rechazada desaparecerá)
      fetchData();
    } catch (err: any) {
      // Muestra alerta de error
      setAlertInfo({
        type: "error",
        title: "Error",
        message: err.message || "Error al rechazar la reserva",
        isVisible: true,
      });
    } finally {
      setIsRejecting(false);
      setIsConfirmOpen(false);
      setRejectingId(null);
    }
  };
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
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

      <form
        onSubmit={handleFilterSubmit}
        className="p-4 bg-gray-50 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
      >
        <div>
          <label
            htmlFor="espacioId"
            className="block text-sm font-medium text-gray-700"
          >
            Espacio
          </label>
          <select
            id="espacioId"
            name="espacioId"
            value={filters.espacioId || "all"}
            onChange={handleFilterChange}
            className={`mt-1 block w-full ${inputStyle}`}
          >
            <option value="all">Todos los Espacios</option>
            {spacesList.map((space) => (
              <option key={space._id} value={space._id}>
                {space.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={filters.date || ""}
            onChange={handleFilterChange}
            className={`mt-1 block w-full ${inputStyle}`}
          />
        </div>
        <button
          type="submit"
          className="
    w-full justify-center
    py-2 px-4 
    border border-transparent rounded-md shadow-sm 
    text-sm font-semibold text-white 
    bg-blue-600 hover:bg-blue-700 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    transition-colors duration-200
  "
        >
          Filtrar
        </button>
      </form>

      {/* Tabla de Pendientes */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={thStyle}>Espacio</th>
              <th className={thStyle}>Email</th>
              <th className={thStyle}>Inicio</th>
              <th className={thStyle}>Fin</th>
              <th className={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className={tdCenter}>
                  Cargando pendientes...
                </td>
              </tr>
            ) : reservations.length > 0 ? (
              reservations.map((res) => (
                <tr key={res._id}>
                  <td className={`${tdStyle} font-medium text-gray-900`}>
                    {getSpaceName(res.espacioId)}
                  </td>
                  <td className={tdStyle}>{res.email}</td>
                  <td className={tdStyle}>{formatDateTime(res.startTime)}</td>
                  <td className={tdStyle}>{formatDateTime(res.endTime)}</td>
                  <td className={`${tdStyle} text-center space-x-2`}>
                    <button
                      onClick={() => handleApprove(res._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleRejectRequest(res._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={tdCenter}>
                  No hay reservas pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmReject}
        title="Confirmar Rechazo"
        message="¿Estás seguro de que quieres rechazar esta reserva?"
        confirmText="Rechazar"
        loading={isRejecting}
      />
    </div>
  );
};

const thStyle =
  "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider";
const tdStyle = "px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center";
const tdCenter = "text-center py-4 text-gray-500";
const inputStyle =
  "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

export default ReservationsPending;
