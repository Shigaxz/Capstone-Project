import apiService from './apiService';
import type { Memory, CreateMemoryData, UpdateMemoryData } from '../interfaces/memories';

export const getMemories = async (): Promise<Memory[]> => {
  try {
    const response = await apiService.get('/memories');
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al obtener memorias');
  }
};

export const createMemory = async (memoryData: CreateMemoryData): Promise<Memory> => {
  try {
    const response = await apiService.post('/memories', memoryData);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al crear memoria');
  }
};

export const updateMemory = async (id: string, memoryData: UpdateMemoryData): Promise<Memory> => {
  try {
    const response = await apiService.patch(`/memories/${id}`, memoryData);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al actualizar memoria');
  }
};

export const deleteMemory = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/memories/${id}`);
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al eliminar memoria');
  }
};

export const getMemoryById = async (id: string): Promise<Memory> => {
  try {
    const response = await apiService.get(`/memories/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al obtener la memoria');
  }
};

export const downloadMemoryPDF = async (id: string, title: string) => {
  try {
    const response = await apiService.get(
      `/memories/${id}/pdf`,
      {
        responseType: 'blob', 
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('download', `memoria-${safeTitle}.pdf`);
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    if (error.response && error.response.data instanceof Blob) {
      const errorText = await error.response.data.text();
      const errorJson = JSON.parse(errorText);
      console.error('Error al descargar el PDF (JSON):', errorJson);
      throw errorJson || new Error('Error al descargar el PDF');
    } else {
      console.error('Error al descargar el PDF:', error.response?.data || error.message);
      throw error.response?.data || new Error('Error al descargar el PDF');
    }
  }
};