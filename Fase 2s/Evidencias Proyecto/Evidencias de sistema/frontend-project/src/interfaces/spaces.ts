export interface Space {
  _id: string;
  name: string;
  lugarId: string;
  capacity: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSpaceData {
  name: string;
  capacity: number;
  isAvailable?: boolean;
}

export interface UpdateSpaceData {
  name?: string;
  capacity?: number;
  isAvailable?: boolean;
}