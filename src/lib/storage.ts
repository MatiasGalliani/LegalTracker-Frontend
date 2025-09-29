import { Cliente, Expediente, Plazo, Audiencia, Honorario, Factura, Usuario } from '@/types';

const STORAGE_VERSION = '1.0.0';
const STORAGE_KEY = 'software-abogados-data';

export interface StorageData {
  version: string;
  clientes: Cliente[];
  expedientes: Expediente[];
  plazos: Plazo[];
  audiencias: Audiencia[];
  honorarios: Honorario[];
  facturas: Factura[];
  usuarios: Usuario[];
}

export const storage = {
  get(): StorageData | null {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      if (parsed.version !== STORAGE_VERSION) {
        // Version mismatch, clear storage
        this.clear();
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set(data: StorageData): void {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const dataWithVersion = { ...data, version: STORAGE_VERSION };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithVersion));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  clear(): void {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
