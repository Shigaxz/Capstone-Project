import type { Space } from './spaces';

export interface Reservation {
  _id: string;
  espacioId: Space | string;
  email: string;
  startTime: string;
  endTime: string;
  isApproved: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReservationData {
  espacioId: string;
  email: string;
  startTime: string;
  duration: number;
}

export interface FindReservationsParams {
  espacioId?: string;
  date?: string;
  isApproved?: 'true' | 'false' | 'null' | 'all';
}