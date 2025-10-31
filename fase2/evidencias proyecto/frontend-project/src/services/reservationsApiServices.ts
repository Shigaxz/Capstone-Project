import apiService from "./apiService";
import type {
  Reservation,
  CreateReservationData,
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
    console.log(
      `[API_CALL] Pidiendo reservas para SpaceID: ${spaceId} en Fecha: ${dateString}`
    );
    const response = await apiService.get(
      `/reservations/availability/${spaceId}`,
      {
        params: {
          date: dateString,
        },
      }
    );

    return response.data;
    console.log("[API_RESPONSE] Datos recibidos:", response.data);
  } catch (error: any) {
    console.error(
      `Error fetching reservations for space ${spaceId} on ${date}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error al obtener disponibilidad");
  }
};
