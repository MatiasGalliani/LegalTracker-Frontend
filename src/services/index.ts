import { db } from '@/lib/db';
import { Cliente, Expediente, Plazo, Audiencia, Honorario, Factura, FiltrosExpedientes, OrdenExpedientes, FiltrosAudiencias, OrdenAudiencias, FiltrosHonorarios, OrdenHonorarios, FiltrosFacturas, OrdenFacturas } from '@/types';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random errors (5% chance)
const shouldSimulateError = () => Math.random() < 0.05;

const simulateError = () => {
  throw new Error('Error de conexión. Intentá nuevamente.');
};

export const expedientesService = {
  async list(filtros?: FiltrosExpedientes, orden?: OrdenExpedientes): Promise<Expediente[]> {
    await delay(400 + Math.random() * 400); // 400-800ms
    
    if (shouldSimulateError()) {
      simulateError();
    }

    let expedientes = db.getExpedientes();

    // Apply filters
    if (filtros) {
      if (filtros.busqueda) {
        const searchTerm = filtros.busqueda.toLowerCase();
        expedientes = expedientes.filter(e => 
          e.numero.toLowerCase().includes(searchTerm) ||
          e.caratula.toLowerCase().includes(searchTerm) ||
          e.clienteId.toLowerCase().includes(searchTerm)
        );
      }

      if (filtros.fuero && filtros.fuero.length > 0) {
        expedientes = expedientes.filter(e => filtros.fuero!.includes(e.fuero));
      }

      if (filtros.estado && filtros.estado.length > 0) {
        expedientes = expedientes.filter(e => filtros.estado!.includes(e.estado));
      }

      if (filtros.jurisdiccion && filtros.jurisdiccion.length > 0) {
        expedientes = expedientes.filter(e => 
          e.jurisdiccion && filtros.jurisdiccion!.includes(e.jurisdiccion)
        );
      }

      if (filtros.fechaDesde) {
        expedientes = expedientes.filter(e => e.creadoEn >= filtros.fechaDesde!);
      }

      if (filtros.fechaHasta) {
        expedientes = expedientes.filter(e => e.creadoEn <= filtros.fechaHasta!);
      }
    }

    // Apply sorting
    if (orden) {
      expedientes.sort((a, b) => {
        let aValue: string | number, bValue: string | number;
        
        switch (orden.campo) {
          case 'actualizadoEn':
            aValue = new Date(a.actualizadoEn).getTime();
            bValue = new Date(b.actualizadoEn).getTime();
            break;
          case 'numero':
            aValue = a.numero;
            bValue = b.numero;
            break;
          case 'caratula':
            aValue = a.caratula;
            bValue = b.caratula;
            break;
          case 'cliente':
            aValue = a.clienteId;
            bValue = b.clienteId;
            break;
          default:
            aValue = new Date(a.actualizadoEn).getTime();
            bValue = new Date(b.actualizadoEn).getTime();
        }

        if (orden.direccion === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    } else {
      // Default sort by actualizadoEn desc
      expedientes.sort((a, b) => 
        new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime()
      );
    }

    return expedientes;
  },

  async get(id: string): Promise<Expediente | undefined> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getExpediente(id);
  },

  async create(data: Omit<Expediente, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Expediente> {
    await delay(500 + Math.random() * 300);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.createExpediente(data);
  },

  async update(id: string, data: Partial<Expediente>): Promise<Expediente | undefined> {
    await delay(400 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.updateExpediente(id, data);
  },

  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.deleteExpediente(id);
  },

  async search(query: string): Promise<Expediente[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    const expedientes = db.getExpedientes();
    const searchTerm = query.toLowerCase();
    
    return expedientes.filter(e => 
      e.numero.toLowerCase().includes(searchTerm) ||
      e.caratula.toLowerCase().includes(searchTerm) ||
      e.clienteId.toLowerCase().includes(searchTerm)
    );
  }
};

export const clientesService = {
  async list(): Promise<Cliente[]> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getClientes();
  },

  async get(id: string): Promise<Cliente | undefined> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getCliente(id);
  },

  async create(data: Omit<Cliente, 'id' | 'creadoEn'>): Promise<Cliente> {
    await delay(400 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.createCliente(data);
  },

  async update(id: string, data: Partial<Cliente>): Promise<Cliente | undefined> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.updateCliente(id, data);
  },

  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.deleteCliente(id);
  },

  async search(query: string): Promise<Cliente[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    const clientes = db.getClientes();
    const searchTerm = query.toLowerCase();
    
    return clientes.filter(c => 
      c.nombre.toLowerCase().includes(searchTerm) ||
      c.documento?.toLowerCase().includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm)
    );
  }
};

export const plazosService = {
  async list(): Promise<Plazo[]> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getPlazos();
  },

  async getByExpediente(expedienteId: string): Promise<Plazo[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getPlazosByExpediente(expedienteId);
  },

  async get(id: string): Promise<Plazo | undefined> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getPlazo(id);
  },

  async create(data: Omit<Plazo, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Plazo> {
    await delay(400 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.createPlazo(data);
  },

  async update(id: string, data: Partial<Plazo>): Promise<Plazo | undefined> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.updatePlazo(id, data);
  },

  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.deletePlazo(id);
  }
};

export const audienciasService = {
  async list(filtros?: FiltrosAudiencias, orden?: OrdenAudiencias): Promise<Audiencia[]> {
    await delay(400 + Math.random() * 400);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    let audiencias = db.getAudiencias();

    // Apply filters
    if (filtros) {
      if (filtros.busqueda) {
        const searchTerm = filtros.busqueda.toLowerCase();
        audiencias = audiencias.filter(a => 
          a.titulo.toLowerCase().includes(searchTerm) ||
          a.descripcion?.toLowerCase().includes(searchTerm) ||
          a.juzgado?.toLowerCase().includes(searchTerm) ||
          a.juez?.toLowerCase().includes(searchTerm)
        );
      }

      if (filtros.tipo && filtros.tipo.length > 0) {
        audiencias = audiencias.filter(a => filtros.tipo!.includes(a.tipo));
      }

      if (filtros.estado && filtros.estado.length > 0) {
        audiencias = audiencias.filter(a => filtros.estado!.includes(a.estado));
      }

      if (filtros.juzgado && filtros.juzgado.length > 0) {
        audiencias = audiencias.filter(a => 
          a.juzgado && filtros.juzgado!.includes(a.juzgado)
        );
      }

      if (filtros.fechaDesde) {
        audiencias = audiencias.filter(a => a.fecha >= filtros.fechaDesde!);
      }

      if (filtros.fechaHasta) {
        audiencias = audiencias.filter(a => a.fecha <= filtros.fechaHasta!);
      }
    }

    // Apply sorting
    if (orden) {
      audiencias.sort((a, b) => {
        let aValue: string | number, bValue: string | number;
        
        switch (orden.campo) {
          case 'fecha':
            aValue = new Date(a.fecha).getTime();
            bValue = new Date(b.fecha).getTime();
            break;
          case 'titulo':
            aValue = a.titulo;
            bValue = b.titulo;
            break;
          case 'tipo':
            aValue = a.tipo;
            bValue = b.tipo;
            break;
          case 'estado':
            aValue = a.estado;
            bValue = b.estado;
            break;
          default:
            aValue = new Date(a.fecha).getTime();
            bValue = new Date(b.fecha).getTime();
        }

        if (orden.direccion === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    } else {
      // Default sort by fecha asc
      audiencias.sort((a, b) => 
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
    }

    return audiencias;
  },

  async get(id: string): Promise<Audiencia | undefined> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getAudiencia(id);
  },

  async getByExpediente(expedienteId: string): Promise<Audiencia[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getAudienciasByExpediente(expedienteId);
  },

  async create(data: Omit<Audiencia, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Audiencia> {
    await delay(500 + Math.random() * 300);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.createAudiencia(data);
  },

  async update(id: string, data: Partial<Audiencia>): Promise<Audiencia | undefined> {
    await delay(400 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.updateAudiencia(id, data);
  },

  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.deleteAudiencia(id);
  },

  async search(query: string): Promise<Audiencia[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    const audiencias = db.getAudiencias();
    const searchTerm = query.toLowerCase();
    
    return audiencias.filter(a => 
      a.titulo.toLowerCase().includes(searchTerm) ||
      a.descripcion?.toLowerCase().includes(searchTerm) ||
      a.juzgado?.toLowerCase().includes(searchTerm) ||
      a.juez?.toLowerCase().includes(searchTerm)
    );
  }
};

export const honorariosService = {
  async list(filtros?: FiltrosHonorarios, orden?: OrdenHonorarios): Promise<Honorario[]> {
    await delay(400 + Math.random() * 400);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    let honorarios = db.getHonorarios();

    // Apply filters
    if (filtros) {
      if (filtros.busqueda) {
        const searchTerm = filtros.busqueda.toLowerCase();
        honorarios = honorarios.filter(h => 
          h.concepto.toLowerCase().includes(searchTerm) ||
          h.descripcion?.toLowerCase().includes(searchTerm) ||
          h.numeroFactura?.toLowerCase().includes(searchTerm) ||
          h.observaciones?.toLowerCase().includes(searchTerm)
        );
      }

      if (filtros.tipo && filtros.tipo.length > 0) {
        honorarios = honorarios.filter(h => filtros.tipo!.includes(h.tipo));
      }

      if (filtros.estado && filtros.estado.length > 0) {
        honorarios = honorarios.filter(h => filtros.estado!.includes(h.estado));
      }

      if (filtros.clienteId && filtros.clienteId.length > 0) {
        honorarios = honorarios.filter(h => filtros.clienteId!.includes(h.clienteId));
      }

      if (filtros.expedienteId && filtros.expedienteId.length > 0) {
        honorarios = honorarios.filter(h => filtros.expedienteId!.includes(h.expedienteId));
      }

      if (filtros.fechaDesde) {
        honorarios = honorarios.filter(h => h.fechaServicio >= filtros.fechaDesde!);
      }

      if (filtros.fechaHasta) {
        honorarios = honorarios.filter(h => h.fechaServicio <= filtros.fechaHasta!);
      }

      if (filtros.montoMin !== undefined) {
        honorarios = honorarios.filter(h => h.monto >= filtros.montoMin!);
      }

      if (filtros.montoMax !== undefined) {
        honorarios = honorarios.filter(h => h.monto <= filtros.montoMax!);
      }
    }

    // Apply sorting
    if (orden) {
      honorarios.sort((a, b) => {
        let aValue: string | number, bValue: string | number;
        
        switch (orden.campo) {
          case 'fechaServicio':
            aValue = new Date(a.fechaServicio).getTime();
            bValue = new Date(b.fechaServicio).getTime();
            break;
          case 'monto':
            aValue = a.monto;
            bValue = b.monto;
            break;
          case 'concepto':
            aValue = a.concepto;
            bValue = b.concepto;
            break;
          case 'estado':
            aValue = a.estado;
            bValue = b.estado;
            break;
          case 'cliente':
            aValue = a.clienteId;
            bValue = b.clienteId;
            break;
          default:
            aValue = new Date(a.fechaServicio).getTime();
            bValue = new Date(b.fechaServicio).getTime();
        }

        if (orden.direccion === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    } else {
      // Default sort by fechaServicio desc
      honorarios.sort((a, b) => 
        new Date(b.fechaServicio).getTime() - new Date(a.fechaServicio).getTime()
      );
    }

    return honorarios;
  },

  async get(id: string): Promise<Honorario | undefined> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getHonorario(id);
  },

  async getByCliente(clienteId: string): Promise<Honorario[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getHonorariosByCliente(clienteId);
  },

  async getByExpediente(expedienteId: string): Promise<Honorario[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getHonorariosByExpediente(expedienteId);
  },

  async create(data: Omit<Honorario, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Honorario> {
    await delay(500 + Math.random() * 300);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.createHonorario(data);
  },

  async update(id: string, data: Partial<Honorario>): Promise<Honorario | undefined> {
    await delay(400 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.updateHonorario(id, data);
  },

  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.deleteHonorario(id);
  },

  async search(query: string): Promise<Honorario[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    const honorarios = db.getHonorarios();
    const searchTerm = query.toLowerCase();
    
    return honorarios.filter(h => 
      h.concepto.toLowerCase().includes(searchTerm) ||
      h.descripcion?.toLowerCase().includes(searchTerm) ||
      h.numeroFactura?.toLowerCase().includes(searchTerm) ||
      h.observaciones?.toLowerCase().includes(searchTerm)
    );
  },

  async getStats(): Promise<{
    total: number;
    pendientes: number;
    facturados: number;
    cobrados: number;
    montoTotal: number;
    montoPendiente: number;
    montoCobrado: number;
  }> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    const honorarios = db.getHonorarios();
    
    return {
      total: honorarios.length,
      pendientes: honorarios.filter(h => h.estado === 'Pendiente').length,
      facturados: honorarios.filter(h => h.estado === 'Facturado').length,
      cobrados: honorarios.filter(h => h.estado === 'Cobrado').length,
      montoTotal: honorarios.reduce((sum, h) => sum + h.monto, 0),
      montoPendiente: honorarios.filter(h => h.estado === 'Pendiente').reduce((sum, h) => sum + h.monto, 0),
      montoCobrado: honorarios.filter(h => h.estado === 'Cobrado').reduce((sum, h) => sum + h.monto, 0)
    };
  }
};

export const facturacionService = {
  async list(filtros?: FiltrosFacturas, orden?: OrdenFacturas): Promise<Factura[]> {
    await delay(400 + Math.random() * 400);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    let facturas = db.getFacturas();

    // Apply filters
    if (filtros) {
      if (filtros.busqueda) {
        const searchTerm = filtros.busqueda.toLowerCase();
        facturas = facturas.filter(f => 
          f.numero.toLowerCase().includes(searchTerm) ||
          f.observaciones?.toLowerCase().includes(searchTerm) ||
          f.numeroComprobante?.toLowerCase().includes(searchTerm)
        );
      }

      if (filtros.estado && filtros.estado.length > 0) {
        facturas = facturas.filter(f => filtros.estado!.includes(f.estado));
      }

      if (filtros.clienteId && filtros.clienteId.length > 0) {
        facturas = facturas.filter(f => filtros.clienteId!.includes(f.clienteId));
      }

      if (filtros.expedienteId && filtros.expedienteId.length > 0) {
        facturas = facturas.filter(f => f.expedienteId && filtros.expedienteId!.includes(f.expedienteId));
      }

      if (filtros.tipoFactura && filtros.tipoFactura.length > 0) {
        facturas = facturas.filter(f => filtros.tipoFactura!.includes(f.tipoFactura));
      }

      if (filtros.fechaDesde) {
        facturas = facturas.filter(f => f.fechaEmision >= filtros.fechaDesde!);
      }

      if (filtros.fechaHasta) {
        facturas = facturas.filter(f => f.fechaEmision <= filtros.fechaHasta!);
      }

      if (filtros.montoMin !== undefined) {
        facturas = facturas.filter(f => f.total >= filtros.montoMin!);
      }

      if (filtros.montoMax !== undefined) {
        facturas = facturas.filter(f => f.total <= filtros.montoMax!);
      }
    }

    // Apply sorting
    if (orden) {
      facturas.sort((a, b) => {
        let aValue: string | number, bValue: string | number;
        
        switch (orden.campo) {
          case 'fechaEmision':
            aValue = new Date(a.fechaEmision).getTime();
            bValue = new Date(b.fechaEmision).getTime();
            break;
          case 'numero':
            aValue = a.numero;
            bValue = b.numero;
            break;
          case 'total':
            aValue = a.total;
            bValue = b.total;
            break;
          case 'estado':
            aValue = a.estado;
            bValue = b.estado;
            break;
          case 'cliente':
            aValue = a.clienteId;
            bValue = b.clienteId;
            break;
          default:
            aValue = new Date(a.fechaEmision).getTime();
            bValue = new Date(b.fechaEmision).getTime();
        }

        if (orden.direccion === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    } else {
      // Default sort by fechaEmision desc
      facturas.sort((a, b) => 
        new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
      );
    }

    return facturas;
  },

  async get(id: string): Promise<Factura | undefined> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getFactura(id);
  },

  async getByCliente(clienteId: string): Promise<Factura[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getFacturasByCliente(clienteId);
  },

  async getByExpediente(expedienteId: string): Promise<Factura[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.getFacturasByExpediente(expedienteId);
  },

  async create(data: Omit<Factura, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<Factura> {
    await delay(500 + Math.random() * 300);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.createFactura(data);
  },

  async update(id: string, data: Partial<Factura>): Promise<Factura | undefined> {
    await delay(400 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.updateFactura(id, data);
  },

  async delete(id: string): Promise<boolean> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    return db.deleteFactura(id);
  },

  async search(query: string): Promise<Factura[]> {
    await delay(200 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    const facturas = db.getFacturas();
    const searchTerm = query.toLowerCase();
    
    return facturas.filter(f => 
      f.numero.toLowerCase().includes(searchTerm) ||
      f.observaciones?.toLowerCase().includes(searchTerm) ||
      f.numeroComprobante?.toLowerCase().includes(searchTerm)
    );
  },

  async getStats(): Promise<{
    total: number;
    emitidas: number;
    pagadas: number;
    vencidas: number;
    montoTotal: number;
    montoEmitido: number;
    montoPagado: number;
    montoVencido: number;
  }> {
    await delay(300 + Math.random() * 200);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    const facturas = db.getFacturas();
    
    return {
      total: facturas.length,
      emitidas: facturas.filter(f => f.estado === 'Emitida' || f.estado === 'Enviada').length,
      pagadas: facturas.filter(f => f.estado === 'Pagada').length,
      vencidas: facturas.filter(f => f.estado === 'Vencida').length,
      montoTotal: facturas.reduce((sum, f) => sum + f.total, 0),
      montoEmitido: facturas.filter(f => f.estado === 'Emitida' || f.estado === 'Enviada').reduce((sum, f) => sum + f.total, 0),
      montoPagado: facturas.filter(f => f.estado === 'Pagada').reduce((sum, f) => sum + f.total, 0),
      montoVencido: facturas.filter(f => f.estado === 'Vencida').reduce((sum, f) => sum + f.total, 0)
    };
  },

  async generateFromHonorarios(honorariosIds: string[], clienteId: string, expedienteId?: string): Promise<Factura> {
    await delay(600 + Math.random() * 400);
    
    if (shouldSimulateError()) {
      simulateError();
    }

    const honorarios = db.getHonorarios().filter(h => honorariosIds.includes(h.id));
    const subtotal = honorarios.reduce((sum, h) => sum + h.monto, 0);
    const impuestos = subtotal * 0.21; // 21% IVA
    const total = subtotal + impuestos;

    // Generate invoice number
    const numero = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const factura: Omit<Factura, 'id' | 'creadoEn' | 'actualizadoEn'> = {
      numero,
      clienteId,
      expedienteId,
      fechaEmision: new Date().toISOString().split('T')[0],
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      subtotal,
      impuestos,
      total,
      moneda: honorarios[0]?.moneda || 'ARS',
      estado: 'Borrador',
      tipoFactura: 'A',
      condicionVenta: 'Cuenta Corriente',
      observaciones: `Factura generada automáticamente desde ${honorarios.length} honorario(s)`,
      honorariosIds
    };

    return db.createFactura(factura);
  }
};
