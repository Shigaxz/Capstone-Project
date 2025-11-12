import apiService from "./apiService";
import type {
  Reservation,
  CreateReservationData,
  FindReservationsParams
} from "../interfaces/reservations";
import { format } from "date-fns";

export const getPendingReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await apiService.get("/reservations/pending");
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    throw (
      error.response?.data || new Error("Error al obtener reservas pendientes")
    );
  }
};

export const getHistoryReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await apiService.get("/reservations/history");
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error("Error al obtener historial de reservas")
    );
  }
};

export const approveReservation = async (id: string): Promise<Reservation> => {
  try {
    const response = await apiService.patch(`/reservations/${id}/approve`);
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error al aprobar reserva");
  }
};

export const rejectReservation = async (id: string): Promise<Reservation> => {
  try {
    const response = await apiService.patch(`/reservations/${id}/reject`);
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error al rechazar reserva");
  }
};

export const createReservation = async (
  reservationData: CreateReservationData
): Promise<Reservation> => {
  try {
    const response = await apiService.post("/reservations", reservationData);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating reservation by admin:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error al crear reserva");
  }
};

export const getReservationsForSpaceAndDate = async (
  spaceId: string,
  date: Date
): Promise<Reservation[]> => {
  try {
    const dateString = format(date, "yyyy-MM-dd");
    const response = await apiService.get(
      `/reservations/availability/${spaceId}`,
      {
        params: {
          date: dateString,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching reservations for space ${spaceId} on ${date}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error al obtener disponibilidad");
  }
};
// Funcion para buscar reservas con filtros opcionales
export const findReservations = async (
  params: FindReservationsParams = {}
): Promise<Reservation[]> => {
  try {
    const response = await apiService.get("/reservations", {
      params: params
    });
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    throw (
      error.response?.data || new Error("Error al buscar reservas")
    );
  }
};
// Funcion para eliminar una reserva por ID
export const deleteReservation = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/reservations/${id}`);
  } catch (error: any) {
    console.error(`Error deleting reservation ${id}:`, error.response?.data || error.message);
    throw error.response?.data || new Error("Error al eliminar reserva");
  }
};
