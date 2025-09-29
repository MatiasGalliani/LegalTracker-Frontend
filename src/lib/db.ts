import { storage, StorageData } from './storage';
import { Cliente, Expediente, Plazo, Usuario, Audiencia, Honorario, Factura } from '@/types';

// Empty initial data - no mock data
const usuariosMock: Usuario[] = [];
const clientesMock: Cliente[] = [];

const expedientesMock: Expediente[] = [];

const plazosMock: Plazo[] = [];

const audienciasMock: Audiencia[] = [];

const honorariosMock: Honorario[] = [];

const facturasMock: Factura[] = [];

class Database {
  private clientes: Cliente[] = [];
  private expedientes: Expediente[] = [];
  private plazos: Plazo[] = [];
  private audiencias: Audiencia[] = [];
  private honorarios: Honorario[] = [];
  private facturas: Factura[] = [];
  private usuarios: Usuario[] = [];

  constructor() {
    // Only load from storage on client side
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    const stored = storage.get();
    if (stored) {
      this.clientes = stored.clientes || [];
      this.expedientes = stored.expedientes || [];
      this.plazos = stored.plazos || [];
      this.audiencias = stored.audiencias || [];
      this.honorarios = stored.honorarios || [];
      this.facturas = stored.facturas || [];
      this.usuarios = stored.usuarios || [];
    } else {
      // Initialize with mock data
      this.clientes = [...clientesMock];
      this.expedientes = [...expedientesMock];
      this.plazos = [...plazosMock];
      this.audiencias = [...audienciasMock];
      this.honorarios = [...honorariosMock];
      this.facturas = [...facturasMock];
      this.usuarios = [...usuariosMock];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    storage.set({
      version: '1.0.0',
      clientes: this.clientes,
      expedientes: this.expedientes,
      plazos: this.plazos,
      audiencias: this.audiencias,
      honorarios: this.honorarios,
      facturas: this.facturas,
      usuarios: this.usuarios
    });
  }

  // Clientes
  getClientes(): Cliente[] {
    return [...this.clientes];
  }

  getCliente(id: string): Cliente | undefined {
    return this.clientes.find(c => c.id === id);
  }

  createCliente(cliente: Omit<Cliente, 'id' | 'creadoEn'>): Cliente {
    const newCliente: Cliente = {
      ...cliente,
      id: Date.now().toString(),
      creadoEn: new Date().toISOString()
    };
    this.clientes.push(newCliente);
    this.saveToStorage();
    return newCliente;
  }

  updateCliente(id: string, updates: Partial<Cliente>): Cliente | undefined {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.clientes[index] = { ...this.clientes[index], ...updates };
    this.saveToStorage();
    return this.clientes[index];
  }

  deleteCliente(id: string): boolean {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.clientes.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Expedientes
  getExpedientes(): Expediente[] {
    return [...this.expedientes];
  }

  getExpediente(id: string): Expediente | undefined {
    return this.expedientes.find(e => e.id === id);
  }

  createExpediente(expediente: Omit<Expediente, 'id' | 'creadoEn' | 'actualizadoEn'>): Expediente {
    const newExpediente: Expediente = {
      ...expediente,
      id: Date.now().toString(),
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };
    this.expedientes.push(newExpediente);
    this.saveToStorage();
    return newExpediente;
  }

  updateExpediente(id: string, updates: Partial<Expediente>): Expediente | undefined {
    const index = this.expedientes.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    
    this.expedientes[index] = { 
      ...this.expedientes[index], 
      ...updates,
      actualizadoEn: new Date().toISOString()
    };
    this.saveToStorage();
    return this.expedientes[index];
  }

  deleteExpediente(id: string): boolean {
    const index = this.expedientes.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    this.expedientes.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Plazos
  getPlazos(): Plazo[] {
    return [...this.plazos];
  }

  getPlazosByExpediente(expedienteId: string): Plazo[] {
    return this.plazos.filter(p => p.expedienteId === expedienteId);
  }

  getPlazo(id: string): Plazo | undefined {
    return this.plazos.find(p => p.id === id);
  }

  createPlazo(plazo: Omit<Plazo, 'id' | 'creadoEn' | 'actualizadoEn'>): Plazo {
    const newPlazo: Plazo = {
      ...plazo,
      id: Date.now().toString(),
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };
    this.plazos.push(newPlazo);
    this.saveToStorage();
    return newPlazo;
  }

  updatePlazo(id: string, updates: Partial<Plazo>): Plazo | undefined {
    const index = this.plazos.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.plazos[index] = { 
      ...this.plazos[index], 
      ...updates,
      actualizadoEn: new Date().toISOString()
    };
    this.saveToStorage();
    return this.plazos[index];
  }

  deletePlazo(id: string): boolean {
    const index = this.plazos.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.plazos.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Audiencias
  getAudiencias(): Audiencia[] {
    return [...this.audiencias];
  }

  getAudiencia(id: string): Audiencia | undefined {
    return this.audiencias.find(a => a.id === id);
  }

  getAudienciasByExpediente(expedienteId: string): Audiencia[] {
    return this.audiencias.filter(a => a.expedienteId === expedienteId);
  }

  createAudiencia(audiencia: Omit<Audiencia, 'id' | 'creadoEn' | 'actualizadoEn'>): Audiencia {
    const newAudiencia: Audiencia = {
      ...audiencia,
      id: Date.now().toString(),
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };
    this.audiencias.push(newAudiencia);
    this.saveToStorage();
    return newAudiencia;
  }

  updateAudiencia(id: string, updates: Partial<Audiencia>): Audiencia | undefined {
    const index = this.audiencias.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.audiencias[index] = { 
      ...this.audiencias[index], 
      ...updates,
      actualizadoEn: new Date().toISOString()
    };
    this.saveToStorage();
    return this.audiencias[index];
  }

  deleteAudiencia(id: string): boolean {
    const index = this.audiencias.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    this.audiencias.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Honorarios
  getHonorarios(): Honorario[] {
    return [...this.honorarios];
  }

  getHonorario(id: string): Honorario | undefined {
    return this.honorarios.find(h => h.id === id);
  }

  getHonorariosByCliente(clienteId: string): Honorario[] {
    return this.honorarios.filter(h => h.clienteId === clienteId);
  }

  getHonorariosByExpediente(expedienteId: string): Honorario[] {
    return this.honorarios.filter(h => h.expedienteId === expedienteId);
  }

  createHonorario(honorario: Omit<Honorario, 'id' | 'creadoEn' | 'actualizadoEn'>): Honorario {
    const newHonorario: Honorario = {
      ...honorario,
      id: Date.now().toString(),
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };
    this.honorarios.push(newHonorario);
    this.saveToStorage();
    return newHonorario;
  }

  updateHonorario(id: string, updates: Partial<Honorario>): Honorario | undefined {
    const index = this.honorarios.findIndex(h => h.id === id);
    if (index === -1) return undefined;
    
    this.honorarios[index] = { 
      ...this.honorarios[index], 
      ...updates,
      actualizadoEn: new Date().toISOString()
    };
    this.saveToStorage();
    return this.honorarios[index];
  }

  deleteHonorario(id: string): boolean {
    const index = this.honorarios.findIndex(h => h.id === id);
    if (index === -1) return false;
    
    this.honorarios.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Facturas
  getFacturas(): Factura[] {
    return [...this.facturas];
  }

  getFactura(id: string): Factura | undefined {
    return this.facturas.find(f => f.id === id);
  }

  getFacturasByCliente(clienteId: string): Factura[] {
    return this.facturas.filter(f => f.clienteId === clienteId);
  }

  getFacturasByExpediente(expedienteId: string): Factura[] {
    return this.facturas.filter(f => f.expedienteId === expedienteId);
  }

  createFactura(factura: Omit<Factura, 'id' | 'creadoEn' | 'actualizadoEn'>): Factura {
    const newFactura: Factura = {
      ...factura,
      id: Date.now().toString(),
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };
    this.facturas.push(newFactura);
    this.saveToStorage();
    return newFactura;
  }

  updateFactura(id: string, updates: Partial<Factura>): Factura | undefined {
    const index = this.facturas.findIndex(f => f.id === id);
    if (index === -1) return undefined;
    
    this.facturas[index] = { 
      ...this.facturas[index], 
      ...updates,
      actualizadoEn: new Date().toISOString()
    };
    this.saveToStorage();
    return this.facturas[index];
  }

  deleteFactura(id: string): boolean {
    const index = this.facturas.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    this.facturas.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Usuarios
  getUsuarios(): Usuario[] {
    return [...this.usuarios];
  }

  getUsuario(id: string): Usuario | undefined {
    return this.usuarios.find(u => u.id === id);
  }
}

export const db = new Database();
