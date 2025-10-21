import React, { useState, useEffect } from 'react';
import type { Space, CreateSpaceData, UpdateSpaceData } from '../../interfaces/spaces';

interface SpaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSpaceData | UpdateSpaceData) => Promise<void>;
  initialData?: Space | null; 
  locationId: string | null;
}

const SpaceFormModal: React.FC<SpaceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  // Recibimos el locationId
  locationId, 
}) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<CreateSpaceData | UpdateSpaceData>({
    name: '',
    capacity: 1,
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialData);

  // Efecto para llenar/resetear el formulario
  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        setFormData({
          name: initialData.name,
          capacity: initialData.capacity,
          isAvailable: initialData.isAvailable,
        });
      } else {
        // Resetea para creación
        setFormData({
          name: '',
          capacity: 1,
          isAvailable: true,
        });
      }
      setError(null);
    }
  }, [isOpen, initialData, isEditing]);

  // Manejador para cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'capacity' ? parseInt(value, 10) || 0 : value,
      }));
    }
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación extra: Asegura que locationId exista si no estamos editando
    if (!isEditing && !locationId) {
        setError('Error: No se ha especificado un lugar para crear el espacio.');
        return;
    }
    setLoading(true);
    setError(null);
    try {
      // Llama a la función pasada por props
      await onSubmit(formData); 
      // Cierra si tiene éxito
      onClose(); 
    } catch (err: any) {
      setError(err.message || 'Error al guardar el espacio.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Editar Espacio' : 'Crear Nuevo Espacio'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">{error}</div>}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Espacio</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
             <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable ?? true}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">Disponible</label>
          </div>

          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              // Deshabilita si no hay locationId para crear
              disabled={loading || (!isEditing && !locationId)} 
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Espacio' : 'Crear Espacio')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpaceFormModal;