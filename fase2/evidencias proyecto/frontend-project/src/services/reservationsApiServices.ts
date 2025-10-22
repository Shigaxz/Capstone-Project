import apiService from './apiService';
import type { Reservation, CreateReservationData } from '../interfaces/reservations';

export const getPendingReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await apiService.get('/reservations/pending');
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al obtener reservas pendientes');
  }
};

export const getHistoryReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await apiService.get('/reservations/history');
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al obtener historial de reservas');
  }
};

export const approveReservation = async (id: string): Promise<Reservation> => {
  try {
    const response = await apiService.patch(`/reservations/${id}/approve`);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al aprobar reserva');
  }
};

export const rejectReservation = async (id: string): Promise<Reservation> => {
  try {
    const response = await apiService.patch(`/reservations/${id}/reject`);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al rechazar reserva');
  }
};

export const createReservation = async (reservationData: CreateReservationData): Promise<Reservation> => {
  try {
    const response = await apiService.post('/reservations', reservationData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating reservation by admin:', error.response?.data || error.message);
    throw error.response?.data || new Error('Error al crear reserva');
  }
};