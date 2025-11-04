/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import React, { useState, useEffect } from 'react';
import { getMemories, deleteMemory, updateMemory, createMemory } from '../../services/memoriesApiService';
import type { Memory, CreateMemoryData, UpdateMemoryData } from '../../interfaces/memories';
import Alert from './Alert'; // Importar el componente Alert
import MemoryFormModal from '../../componentes/componentes_admin/MemoryFormModal';
import ConfirmationModal from '../ConfirmationModal';

const MemoryManager: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingMemoryId, setDeletingMemoryId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string; isVisible: boolean }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false,
  });

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setLoading(true);
    setAlertInfo({ ...alertInfo, isVisible: false });
    try {
      const data = await getMemories();
      setMemories(data);
    } catch (err: any) {
      setAlertInfo({ type: 'error', title: 'Error', message: err.message || 'Error al cargar memorias', isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingMemoryId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMemoryId) return;

    setIsDeleting(true);
    try {
      await deleteMemory(deletingMemoryId);
      fetchMemories(); // Recarga la lista
      setAlertInfo({ type: 'success', title: 'Éxito', message: 'Memoria eliminada correctamente.', isVisible: true });
    } catch (err: any) {
      setAlertInfo({ type: 'error', title: 'Error', message: err.message || 'Error al eliminar la memoria.', isVisible: true });
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
      setDeletingMemoryId(null);
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
        setAlertInfo({ type: 'success', title: 'Éxito', message: 'Memoria actualizada con éxito.', isVisible: true });
      } else {
        // Lógica de Creación
        await createMemory(data as CreateMemoryData); 
        setAlertInfo({ type: 'success', title: 'Éxito', message: 'Memoria creada con éxito.', isVisible: true });
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
                    <button onClick={() => handleDeleteRequest(memory._id)} className="text-red-600 hover:text-red-900">Eliminar</button>
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
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar esta memoria? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        loading={isDeleting}
      />
    </div>
  );
};

export default MemoryManager;