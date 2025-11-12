import React, { useState, useEffect, useCallback } from "react";
import {
  findReservations,
  approveReservation,
  rejectReservation,
  deleteReservation
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

const ReservationsAll: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [spacesList, setSpacesList] = useState<Space[]>([]);
  const [filters, setFilters] = useState<FindReservationsParams>({});

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar espacios para el filtro (solo una vez)
  useEffect(() => {
    getAllSpaces().then(setSpacesList).catch(console.error);
  }, []);

  // Función de carga de datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    setAlertInfo({ ...alertInfo, isVisible: false });

    // Prepara filtros (omite los 'all' o vacíos)
    const queryParams: FindReservationsParams = {};
    if (filters.espacioId && filters.espacioId !== "all")
      queryParams.espacioId = filters.espacioId;
    if (filters.isApproved && filters.isApproved !== "all")
      queryParams.isApproved = filters.isApproved;
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
        message: err.message || "Error al cargar reservas",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData(); // Carga inicial
  }, [fetchData]);

  // Manejadores de acciones
  const handleApprove = async (id: string) => {
    setAlertInfo({ ...alertInfo, isVisible: false });
    try {
      await approveReservation(id);
      setAlertInfo({
        type: "success",
        title: "Éxito",
        message: "Reserva aprobada. Se ha notificado al usuario.",
        isVisible: true,
      });
      fetchData(); // Recarga la lista
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
    if (!rejectingId) return;

    setIsRejecting(true);
    setAlertInfo({ ...alertInfo, isVisible: false });
    try {
      await rejectReservation(rejectingId);
      setAlertInfo({
        type: "success",
        title: "Éxito",
        message: "Reserva rechazada. Se ha notificado al usuario.",
        isVisible: true,
      });
      fetchData();
    } catch (err: any) {
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

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true); // Activa el loading del modal
    setAlertInfo({ ...alertInfo, isVisible: false });

    try {
      await deleteReservation(deletingId);
      setAlertInfo({
        type: "success",
        title: "Éxito",
        message: "La reserva ha sido eliminada permanentemente.",
        isVisible: true,
      });
      fetchData(); // Recarga la lista
    } catch (err: any) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: err.message || "Error al eliminar la reserva",
        isVisible: true,
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeletingId(null);
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
  const resetFilters = () => {
    setFilters({});
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
        className="p-4 bg-gray-50 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end"
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
        <div>
          <label
            htmlFor="isApproved"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <select
            id="isApproved"
            name="isApproved"
            value={filters.isApproved || "all"}
            onChange={handleFilterChange}
            className={`mt-1 block w-full ${inputStyle}`}
          >
            <option value="all">Todos los Estados</option>
            <option value="null">Pendiente</option>
            <option value="true">Aprobada</option>
            <option value="false">Rechazada</option>
          </select>
        </div>
        <div className="md:col-span-1 lg:col-span-2 flex space-x-2">
          <button
            type="submit"
            className="
            flex-1 w-full justify-center 
            py-2 px-4 
            border border-transparent rounded-md shadow-sm 
            text-sm font-medium text-white 
            bg-blue-600 hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200
            "
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="
            flex-1 w-full justify-center 
            py-2 px-4 
            border border-gray-300 rounded-md shadow-sm 
            text-sm font-medium text-gray-700 
            bg-white hover:bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200
            "
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Tabla de Todas las Reservas */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={thStyle}>Estado</th>
              <th className={thStyle}>Espacio</th>
              <th className={thStyle}>Email</th>
              <th className={thStyle}>Inicio</th>
              <th className={`${thStyle} text-right`}>Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className={tdCenter}>
                  Cargando reservas...
                </td>
              </tr>
            ) : reservations.length > 0 ? (
              reservations.map((res) => (
                <tr
                  key={res._id}
                  className={
                    res.isApproved === false
                      ? "bg-red-50/50"
                      : res.isApproved === null
                      ? "bg-yellow-50/50"
                      : ""
                  }
                >
                  <td className={tdStyle}>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        res.isApproved === true
                          ? "bg-green-100 text-green-800"
                          : res.isApproved === false
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {res.isApproved === true
                        ? "Aprobada"
                        : res.isApproved === false
                        ? "Rechazada"
                        : "Pendiente"}
                    </span>
                  </td>
                  <td className={`${tdStyle} font-medium text-gray-900`}>
                    {getSpaceName(res.espacioId)}
                  </td>
                  <td className={tdStyle}>{res.email}</td>
                  <td className={tdStyle}>{formatDateTime(res.startTime)}</td>
                  <td className={`${tdStyle} text-right space-x-2`}>
                    {res.isApproved === null && (
                      <>
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
                      </>
                    )}
                    {res.isApproved !== null && (
                      <button
                        onClick={() => handleDelete(res._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={tdCenter}>
                  No se encontraron reservas con esos filtros.
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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
const inputStyle =
  "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

export default ReservationsAll;
