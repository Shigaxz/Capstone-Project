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