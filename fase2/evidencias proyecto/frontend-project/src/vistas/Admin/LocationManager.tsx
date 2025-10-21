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
import LocationFormModal from "../../componentes/componentes_admin/LocationFormModal";

const LocationManager: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar lugares");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este lugar?")) {
      try {
        await deleteLocation(id);
        fetchLocations(); // Recarga la lista
        alert("Lugar eliminado.");
      } catch (err: any) {
        setError(err.message || "Error al eliminar");
      }
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
        alert("Lugar actualizado con éxito.");
      } else {
        await createLocation(data as CreateLocationData);
        alert("Lugar creado con éxito.");
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
                      onClick={() => handleDelete(location._id)}
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
    </div>
  );
};

export default LocationManager;
