export interface Location {
  _id: string;
  name: string;
  floor: number;
  espacioId: string[];
  isAvailable: boolean;
  urlImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLocationData {
  name: string;
  floor: number;
  urlImage?: string;
  isAvailable?: boolean;
}

export interface UpdateLocationData {
  name?: string;
  floor?: number;
  urlImage?: string;
  isAvailable?: boolean;
}