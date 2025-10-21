import React, { useState, useEffect } from "react";
import type {
  Location,
  CreateLocationData,
  UpdateLocationData,
} from "../../interfaces/Locations";

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLocationData | UpdateLocationData) => Promise<void>;
  initialData?: Location | null;
}

const LocationFormModal: React.FC<LocationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<
    CreateLocationData | UpdateLocationData
  >({
    name: "",
    floor: 1, // Valor por defecto
    urlImage: "",
    isAvailable: true, // Valor por defecto
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determina si estamos editando
  const isEditing = Boolean(initialData);

  // Efecto para llenar el formulario si estamos editando
  useEffect(() => {
    if (isEditing && initialData) {
      // Llena el formulario con los datos existentes
      setFormData({
        name: initialData.name,
        floor: initialData.floor,
        urlImage: initialData.urlImage || "",
        isAvailable: initialData.isAvailable,
      });
    } else {
      // Resetea el formulario si es para crear uno nuevo
      setFormData({
        name: "",
        floor: 1,
        urlImage: "",
        isAvailable: true,
      });
    }
    // Limpia errores al abrir/cambiar modo
    setError(null);
  }, [isOpen, initialData, isEditing]); // Se ejecuta cuando cambia isOpen o initialData

  // Manejador para cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Manejo especial para checkbox
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      // Manejo para inputs de texto y número
      setFormData((prev) => ({
        ...prev,
        // Convierte a número si es el campo 'floor'
        [name]: name === "floor" ? parseInt(value, 10) || 0 : value,
      }));
    }
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar el lugar.");
    } finally {
      setLoading(false);
    }
  };

  // Si el modal no está abierto, no renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay oscuro de fondo
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Editar Lugar" : "Crear Nuevo Lugar"}
          </h2>
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

          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
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
            <label
              htmlFor="floor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Piso
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              min="0" // O el mínimo que necesites
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="urlImage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              URL de la Imagen (Opcional)
            </label>
            <input
              type="url"
              id="urlImage"
              name="urlImage"
              value={formData.urlImage || ""}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            <label
              htmlFor="isAvailable"
              className="ml-2 block text-sm text-gray-900"
            >
              Disponible
            </label>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : isEditing
                ? "Actualizar Lugar"
                : "Crear Lugar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationFormModal;
