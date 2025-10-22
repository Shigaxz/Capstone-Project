export interface Memory {
  _id: string;
  title: string;
  members: string[];
  teacher: string;
  company?: string;
  year: number;
  description: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
 
}

// Interface para crear 
export interface CreateMemoryData {
  title: string;
  members: string[];
  teacher: string;
  company?: string;
  year: number;
  description: string;
  images?: string[];
}

// Interface para actualizar
export interface UpdateMemoryData {
  title?: string;
  members?: string[];
  teacher?: string;
  company?: string;
  year?: number;
  description?: string;
  images?: string[];
}