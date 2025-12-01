import apiService from './apiService';
import type {
  Location,
  CreateLocationData,
  UpdateLocationData,
} from '../interfaces/Locations';

// Metodo GET
export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await apiService.get('/locations');
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al obtener lugares');
  }
};
// Metodo GET::id
export const getLocationById = async (id: string): Promise<Location> => {
  try {
    const response = await apiService.get(`/locations/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al obtener el lugar');
  }
}; 
// Metodo POST
export const createLocation = async (locationData: CreateLocationData): Promise<Location> => {
  try {
    const response = await apiService.post('/locations', locationData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating location:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al crear lugar');
  }
};
// Metodo PATCH
export const updateLocation = async (id: string, locationData: UpdateLocationData): Promise<Location> => {
  try {
    const response = await apiService.patch(`/locations/${id}`, locationData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating location:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al actualizar lugar');
  }
};
// Metodo DELETE
export const deleteLocation = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/locations/${id}`);
  } catch (error: any) {
    console.error('Error deleting location:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al eliminar lugar');
  }
};