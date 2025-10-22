import React, { useState, useEffect } from 'react';
import { getMemories, deleteMemory, updateMemory, createMemory } from '../../services/memoriesApiService';
import type { Memory, CreateMemoryData, UpdateMemoryData } from '../../interfaces/memories';
import MemoryFormModal from '../../componentes/componentes_admin/MemoryFormModal';

const MemoryManager: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMemories();
      setMemories(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar memorias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar esta memoria?')) {
      try {
        await deleteMemory(id);
        fetchMemories(); // Recarga la lista
        alert('Memoria eliminada.');
      } catch (err: any) {
        setError(err.message || 'Error al eliminar');
      }
    }
  };

  const handleAdd = () => {
    setEditingMemory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const handleSubmitForm = async (data: CreateMemoryData | UpdateMemoryData) => {
    try {
      if (editingMemory) {
        // Lógica de Actualización
        await updateMemory(editingMemory._id, data); 
        alert('Memoria actualizada con éxito.');
      } else {
        // Lógica de Creación
        await createMemory(data as CreateMemoryData); 
        alert('Memoria creada con éxito.');
      }
      fetchMemories(); // Recarga la lista
    } catch (err: any) {
      throw err; // Pasa el error al modal
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestionar Memorias</h1>
        <button
          onClick={handleAdd}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
        >
          + Añadir Memoria
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memories.map((memory) => (
                <tr key={memory._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{memory.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{memory.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{memory.teacher}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(memory)} className="text-yellow-600 hover:text-yellow-900">Editar</button>
                    <button onClick={() => handleDelete(memory._id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              ))}
               {memories.length === 0 && (
                 <tr><td colSpan={4} className="text-center py-4 text-gray-500">No hay memorias para mostrar.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <MemoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        initialData={editingMemory}
      />
    </div>
  );
};

export default MemoryManager;