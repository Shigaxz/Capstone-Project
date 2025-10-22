import React, { useState, useEffect } from 'react';
import type { CreateReservationData } from '../../interfaces/reservations';
import type { Space } from '../../interfaces/spaces';
import { getAllSpaces } from '../../services/spacesApiServices';

// Props que el modal recibirá
interface ReservationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReservationData) => Promise<void>; // Llama a createReservationByAdmin
}

const ReservationFormModal: React.FC<ReservationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<CreateReservationData>({
    espacioId: '',
    email: '',
    startTime: '',
    duration: 30, // Valor por defecto
  });
  const [availableSpaces, setAvailableSpaces] = useState<Space[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar los espacios disponibles cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setLoadingSpaces(true);
      setError(null);
      // Resetea el formulario cada vez que se abre
      setFormData({
        espacioId: '',
        email: '',
        startTime: '',
        duration: 30,
      });
      // Llama a la función para obtener todos los espacios
      getAllSpaces() 
        .then((spaces) => {
          setAvailableSpaces(spaces);
        })
        .catch(() => {
          setError('Error al cargar la lista de espacios disponibles.');
        })
        .finally(() => {
          setLoadingSpaces(false);
        });
    }
  }, [isOpen]);

  // Manejador para cambios en los inputs y select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value, 10) : value,
    }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la reserva.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Si el modal no está abierto, no renderiza nada
  if (!isOpen) {
    return null;
  }

  // JSX del Modal
  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Crear Nueva Reserva (Admin)</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="espacioId" className="block text-sm font-medium text-gray-700 mb-1">Espacio</label>
            <select
              id="espacioId"
              name="espacioId"
              value={formData.espacioId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              required
              disabled={loadingSpaces}
            >
              <option value="" disabled>
                {loadingSpaces ? 'Cargando espacios...' : '-- Selecciona un espacio --'}
              </option>
              {availableSpaces.map((space) => (
                <option key={space._id} value={space._id}>
                  {space.name} (Cap: {space.capacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email del Solicitante</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nombre.apellido@duocuc.cl"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora de Inicio</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={30}>30 minutos</option>
              <option value={60}>60 minutos</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={loadingSubmit}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
              disabled={loadingSubmit || loadingSpaces}
            >
              {loadingSubmit ? 'Creando...' : 'Crear Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationFormModal;