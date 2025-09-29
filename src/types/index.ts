export type Cliente = {
  id: string;
  tipo: "persona" | "empresa";
  nombre: string;
  documento?: string;
  email?: string;
  telefono?: string;
  creadoEn: string;
};

export type Expediente = {
  id: string;
  numero: string;
  caratula: string;
  fuero: "Laboral" | "Civil" | "Comercial" | "Penal" | "Familia" | "Otros";
  juzgado?: string;
  jurisdiccion?: string;
  estado: "Abierto" | "En trámite" | "Cerrado";
  clienteId: string;
  responsables: string[]; // ids de usuarios (mock)
  notas?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type Plazo = {
  id: string;
  expedienteId: string;
  tipo: "Presentación" | "Contestación" | "Oficio" | "Audiencia" | "Otro";
  titulo: string;
  descripcion?: string;
  inicio: string;
  vence: string;
  todoElDia: boolean;
  prioridad: "Alta" | "Media" | "Baja";
  estado: "Pendiente" | "Hecho" | "Vencido";
  creadoEn: string;
  actualizadoEn: string;
};

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: "Admin" | "Abogado" | "Asistente";
};

export type FiltrosExpedientes = {
  busqueda?: string;
  fuero?: string[];
  estado?: string[];
  jurisdiccion?: string[];
  fechaDesde?: string;
  fechaHasta?: string;
};

export type OrdenExpedientes = {
  campo: "actualizadoEn" | "numero" | "caratula" | "cliente";
  direccion: "asc" | "desc";
};

export type Audiencia = {
  id: string;
  expedienteId: string;
  titulo: string;
  descripcion?: string;
  fecha: string;
  hora: string;
  duracion: number; // en minutos
  tipo: "Audiencia Preliminar" | "Mediación" | "Conciliación" | "Vista" | "Sentencia" | "Otro";
  estado: "Programada" | "En curso" | "Realizada" | "Cancelada" | "Aplazada";
  juzgado?: string;
  sala?: string;
  juez?: string;
  ubicacion?: string;
  notas?: string;
  recordatorio?: string; // tiempo en minutos antes de la audiencia
  creadoEn: string;
  actualizadoEn: string;
};

export type FiltrosAudiencias = {
  busqueda?: string;
  tipo?: string[];
  estado?: string[];
  fechaDesde?: string;
  fechaHasta?: string;
  juzgado?: string[];
};

export type OrdenAudiencias = {
  campo: "fecha" | "titulo" | "tipo" | "estado";
  direccion: "asc" | "desc";
};

export type Honorario = {
  id: string;
  expedienteId: string;
  clienteId: string;
  concepto: string;
  descripcion?: string;
  monto: number;
  moneda: "ARS" | "USD" | "EUR";
  tipo: "Honorarios" | "Gastos" | "Honorarios + Gastos" | "Anticipo" | "Otro";
  estado: "Pendiente" | "Facturado" | "Cobrado" | "Vencido" | "Cancelado";
  fechaServicio: string;
  fechaVencimiento?: string;
  fechaCobro?: string;
  formaPago?: "Efectivo" | "Transferencia" | "Cheque" | "Tarjeta" | "Otro";
  observaciones?: string;
  numeroFactura?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type FiltrosHonorarios = {
  busqueda?: string;
  tipo?: string[];
  estado?: string[];
  clienteId?: string[];
  expedienteId?: string[];
  fechaDesde?: string;
  fechaHasta?: string;
  montoMin?: number;
  montoMax?: number;
};

export type OrdenHonorarios = {
  campo: "fechaServicio" | "monto" | "concepto" | "estado" | "cliente";
  direccion: "asc" | "desc";
};

export type Factura = {
  id: string;
  numero: string;
  clienteId: string;
  expedienteId?: string;
  fechaEmision: string;
  fechaVencimiento: string;
  fechaPago?: string;
  subtotal: number;
  impuestos: number;
  total: number;
  moneda: "ARS" | "USD" | "EUR";
  estado: "Borrador" | "Emitida" | "Enviada" | "Pagada" | "Vencida" | "Cancelada";
  tipoFactura: "A" | "B" | "C" | "E";
  condicionVenta: "Contado" | "Cuenta Corriente" | "Cheque" | "Tarjeta";
  observaciones?: string;
  honorariosIds: string[];
  formaPago?: "Efectivo" | "Transferencia" | "Cheque" | "Tarjeta" | "Otro";
  numeroComprobante?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type FiltrosFacturas = {
  busqueda?: string;
  estado?: string[];
  clienteId?: string[];
  expedienteId?: string[];
  fechaDesde?: string;
  fechaHasta?: string;
  montoMin?: number;
  montoMax?: number;
  tipoFactura?: string[];
};

export type OrdenFacturas = {
  campo: "fechaEmision" | "numero" | "total" | "estado" | "cliente";
  direccion: "asc" | "desc";
};
