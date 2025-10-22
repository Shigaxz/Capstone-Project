import React, { useState, useEffect } from 'react';
import type { Memory, CreateMemoryData, UpdateMemoryData } from '../../interfaces/memories';

interface MemoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemoryData | UpdateMemoryData) => Promise<void>;
  initialData?: Memory | null;
}

const MemoryFormModal: React.FC<MemoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  // Estado inicial ahora incluye arrays vacíos o con un elemento inicial si lo prefieres
  const [formData, setFormData] = useState<CreateMemoryData | UpdateMemoryData>({
    title: '',
    members: [''], // Empezar con un campo de integrante
    teacher: '',
    company: '',
    year: new Date().getFullYear(),
    images: [''],  // Empezar con un campo de imagen
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialData);

  // Efecto para llenar/resetear el formulario
  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        setFormData({
          title: initialData.title,
          // Si no hay miembros/imágenes, asegura al menos un campo vacío
          members: initialData.members.length > 0 ? initialData.members : [''],
          teacher: initialData.teacher,
          company: initialData.company || '',
          year: initialData.year,
          images: initialData.images.length > 0 ? initialData.images : [''],
        });
      } else {
        // Resetea para creación con un campo inicial para cada array
        setFormData({
          title: '',
          members: [''],
          teacher: '',
          company: '',
          year: new Date().getFullYear(),
          images: [''],
        });
      }
      setError(null);
    }
  }, [isOpen, initialData, isEditing]);

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value, 10) || new Date().getFullYear() : value,
    }));
  };

  const handleMemberChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newMembers = [...(formData.members || [])];
    newMembers[index] = event.target.value;
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const addMemberField = () => {
    setFormData(prev => ({ ...prev, members: [...(prev.members || []), ''] }));
  };

  const removeMemberField = (index: number) => {
    if ((formData.members || []).length <= 1) return; 
    const newMembers = (formData.members || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = event.target.value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const removeImageField = (index: number) => {
    if ((formData.images || []).length <= 1) return;
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = {
        ...formData,
        members: (formData.members || []).filter(m => m.trim() !== ''),
        images: (formData.images || []).filter(img => img.trim() !== ''),
    };

    if (dataToSubmit.members.length === 0) {
        setError("Debe haber al menos un integrante.");
        setLoading(false);
        return;
    }

    try {
      await onSubmit(dataToSubmit);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la memoria.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
  <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 transition-opacity duration-300">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Editar Memoria' : 'Crear Nueva Memoria'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleSimpleChange}
            // 👇 Estilos del input de Location
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Integrantes</label>
          {(formData.members || []).map((member, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={member}
                onChange={(e) => handleMemberChange(index, e)}
                placeholder={`Nombre Integrante ${index + 1}`}
                // 👇 Estilos del input de Location
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required={index === 0}
              />
              <button
                type="button"
                onClick={() => removeMemberField(index)}
                // Estilo consistente para el botón de eliminar
                className={`text-red-500 hover:text-red-700 font-bold p-1 rounded ${ (formData.members || []).length <= 1 ? 'opacity-50 cursor-not-allowed' : '' }`}
                disabled={(formData.members || []).length <= 1}
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMemberField}
            className="mt-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Añadir Integrante
          </button>
        </div>

        <div>
          <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">Profesor Guía</label>
          <input
            type="text"
            id="teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleSimpleChange}
            // 👇 Estilos del input de Location
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Empresa (Opcional)</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company || ''}
            onChange={handleSimpleChange}
            // 👇 Estilos del input de Location
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Año</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleSimpleChange}
            // 👇 Estilos del input de Location
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URLs de Imágenes (Opcional)</label>
           {(formData.images || []).map((image, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(index, e)}
                placeholder={`https://ejemplo.com/imagen${index + 1}.jpg`}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
               <button
                type="button"
                onClick={() => removeImageField(index)}
                className={`text-red-500 hover:text-red-700 font-bold p-1 rounded ${ (formData.images || []).length <= 1 ? 'opacity-50 cursor-not-allowed' : '' }`}
                disabled={(formData.images || []).length <= 1}
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Añadir URL de Imagen
          </button>
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
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Memoria' : 'Crear Memoria')}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default MemoryFormModal;