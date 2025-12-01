import React, { useState, useEffect } from "react";
import type {
  Location,
  CreateLocationData,
  UpdateLocationData,
} from "../../interfaces/Locations";
import {
  getLocations,
  deleteLocation,
  createLocation,
  updateLocation,
} from "../../services/locationsApiServices";
import Alert from './Alert'; // Importar el componente Alert
import LocationFormModal from "../../componentes/componentes_admin/LocationFormModal";
import ConfirmationModal from "../ConfirmationModal";

const LocationManager: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string; isVisible: boolean }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false,
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    setAlertInfo({ ...alertInfo, isVisible: false });
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (err: any) {
      setAlertInfo({ type: 'error', title: 'Error', message: err.message || 'Error al cargar lugares', isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingLocationId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLocationId) return;

    setIsDeleting(true);
    try {
      await deleteLocation(deletingLocationId);
      fetchLocations(); // Recarga la lista
      setAlertInfo({ type: 'success', title: 'Éxito', message: 'Lugar eliminado correctamente.', isVisible: true });
    } catch (err: any) {
      setAlertInfo({ type: 'error', title: 'Error', message: err.message || 'Error al eliminar el lugar.', isVisible: true });
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
      setDeletingLocationId(null);
    }
  };

  const handleAdd = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  const handleSubmitForm = async (
    data: CreateLocationData | UpdateLocationData
  ) => {
    try {
      if (editingLocation) {
        await updateLocation(editingLocation._id, data);
        setAlertInfo({ type: 'success', title: 'Éxito', message: 'Lugar actualizado con éxito.', isVisible: true });
      } else {
        await createLocation(data as CreateLocationData);
        setAlertInfo({ type: 'success', title: 'Éxito', message: 'Lugar creado con éxito.', isVisible: true });
      }
      fetchLocations();
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestionar Lugares</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          + Añadir Lugar
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

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Piso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponible
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((location) => (
                <tr key={location._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {location.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {location.floor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {location.isAvailable ? "Sí" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(location)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(location._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No hay lugares para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <LocationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        initialData={editingLocation}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este lugar? Todos los espacios asociados también serán eliminados. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        loading={isDeleting}
      />
    </div>
  );
};

export default LocationManager;
