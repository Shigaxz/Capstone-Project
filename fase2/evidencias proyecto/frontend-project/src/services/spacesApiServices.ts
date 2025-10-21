import apiService from './apiService'; 
import type {
  Space,
  CreateSpaceData,
  UpdateSpaceData,
} from '../interfaces/spaces';

// Metodo GET para obtener los Espacios de Lugar
export const getSpacesByLocation = async (locationId: string): Promise<Space[]> => {
  try {
    const response = await apiService.get(`/locations/${locationId}/spaces`);
    return response.data;
  } catch (error: any) {
    console.error(`Error con lugar id: ${locationId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error('Error al obtener espacios');
  }
};
// Metodo POST
export const createSpace = async (locationId: string, spaceData: CreateSpaceData): Promise<Space> => {
  try {
    const response = await apiService.post(`/locations/${locationId}/spaces`, spaceData);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al crear espacio');
  }
};
// Metodo Patch
export const updateSpace = async (id: string, spaceData: UpdateSpaceData): Promise<Space> => {
  try {
    const response = await apiService.patch(`/spaces/${id}`, spaceData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating space:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al actualizar espacio');
  }
};
// Metodo DELETE
export const deleteSpace = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/spaces/${id}`);
  } catch (error: any) {
    console.error('Error deleting space:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al eliminar espacio');
  }
};