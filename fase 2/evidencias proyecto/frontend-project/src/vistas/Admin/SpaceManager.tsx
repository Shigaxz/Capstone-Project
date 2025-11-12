import React, { useState, useEffect } from 'react';
import type { Location } from '../../interfaces/Locations';
import { getLocations } from '../../services/locationsApiServices';
import type { Space, CreateSpaceData, UpdateSpaceData } from '../../interfaces/spaces';
import { getSpacesByLocation, createSpace, updateSpace, deleteSpace } from '../../services/spacesApiServices';
import SpaceFormModal from '../../componentes/componentes_admin/SpaceFormModal';
import Alert from './Alert'; // Importar el componente Alert
import ConfirmationModal from '../ConfirmationModal'; // 1. Importar el nuevo modal

const SpaceManager: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  
  // 2. Estados para el modal de confirmación
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingSpaceId, setDeletingSpaceId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string; isVisible: boolean }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false,
  });

  // Carga los lugares al inicio para el selector
  useEffect(() => {
    setLoadingLocations(true);
    getLocations()
      .then(setLocations)
      .catch(err => setAlertInfo({ type: 'error', title: 'Error', message: err.message || 'Error al cargar lugares', isVisible: true }))
      .finally(() => setLoadingLocations(false));
  }, []);

  // Carga los espacios cuando cambia el lugar seleccionado
  useEffect(() => {
    if (selectedLocationId) {
      fetchSpaces(selectedLocationId);
    } else {
      setSpaces([]); // Limpia si no hay lugar seleccionado
    }
  }, [selectedLocationId]);

  const fetchSpaces = async (locationId: string) => {
    setLoadingSpaces(true);
    setAlertInfo({ ...alertInfo, isVisible: false });
    try {
      const data = await getSpacesByLocation(locationId);
      setSpaces(data);
    } catch (err: any) {
      setAlertInfo({ type: 'error', title: 'Error', message: err.message || 'Error al cargar espacios', isVisible: true });
    } finally {
      setLoadingSpaces(false);
    }
  };

  // 3. Abre el modal de confirmación
  const handleDeleteRequest = (id: string) => {
    setDeletingSpaceId(id);
    setIsConfirmModalOpen(true);
  };

  // 4. Ejecuta la eliminación si se confirma
  const handleConfirmDelete = async () => {
    if (!deletingSpaceId) return;
    setIsDeleting(true);
    try {
      await deleteSpace(deletingSpaceId);
      if (selectedLocationId) fetchSpaces(selectedLocationId); // Recarga
      setAlertInfo({ type: 'success', title: 'Éxito', message: 'Espacio eliminado correctamente.', isVisible: true });
    } catch (err: any) {
      setAlertInfo({ type: 'error', title: 'Error', message: err.message || 'Error al eliminar el espacio.', isVisible: true });
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
      setDeletingSpaceId(null);
    }
  };

  const handleAdd = () => {
    if (!selectedLocationId) return setAlertInfo({ type: 'warning', title: 'Atención', message: 'Selecciona un lugar primero para añadir un espacio.', isVisible: true });
    setEditingSpace(null);
    setIsSpaceModalOpen(true);
  };

  const handleEdit = (space: Space) => {
    setEditingSpace(space);
    setIsSpaceModalOpen(true);
  };

  const handleCloseSpaceModal = () => {
    setIsSpaceModalOpen(false);
    setEditingSpace(null);
  };

  const handleSubmitSpaceForm = async (data: CreateSpaceData | UpdateSpaceData) => {
    try {
      if (editingSpace) {
        await updateSpace(editingSpace._id, data);
        setAlertInfo({ type: 'success', title: 'Éxito', message: 'Espacio actualizado con éxito.', isVisible: true });
      } else if (selectedLocationId) {
        await createSpace(selectedLocationId, data as CreateSpaceData);
        setAlertInfo({ type: 'success', title: 'Éxito', message: 'Espacio creado con éxito.', isVisible: true });
      }
      if (selectedLocationId) fetchSpaces(selectedLocationId);
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestionar Espacios</h1>
        {selectedLocationId && (
          <button
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            + Añadir Espacio
          </button>
        )}
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

      {/* --- Selector de Lugar --- */}
      <div className="mb-6">
        <label htmlFor="locationSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Selecciona un Lugar:
        </label>
        <select
          id="locationSelect"
          value={selectedLocationId ?? ''}
          onChange={(e) => setSelectedLocationId(e.target.value || null)}
          className="w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          disabled={loadingLocations}
        >
          <option value="">-- Elige un lugar --</option>
          {locations.map(loc => (
            <option key={loc._id} value={loc._id}>{loc.name}</option>
          ))}
        </select>
        {loadingLocations && <span className="ml-2 text-sm text-gray-500">Cargando lugares...</span>}
      </div>

      {/* --- Tabla de Espacios --- */}
      {selectedLocationId && (
        loadingSpaces ? (
          <p>Cargando espacios...</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponible</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {spaces.map((space) => (
                  <tr key={space._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{space.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{space.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{space.isAvailable ? 'Sí' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(space)} className="text-yellow-600 hover:text-yellow-900">Editar</button>
                      <button onClick={() => handleDeleteRequest(space._id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                  </tr>
                ))}
                {spaces.length === 0 && (
                   <tr><td colSpan={4} className="text-center py-4 text-gray-500">No hay espacios en este lugar.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )
      )}
      <SpaceFormModal
        isOpen={isSpaceModalOpen}
        onClose={handleCloseSpaceModal}
        onSubmit={handleSubmitSpaceForm}
        initialData={editingSpace}
        locationId={selectedLocationId}
      />
      {/* 5. Renderizar el modal de confirmación */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este espacio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        loading={isDeleting}
      />
    </div>
  );
};

export default SpaceManager;