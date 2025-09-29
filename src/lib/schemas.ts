import { z } from 'zod';

export const expedienteSchema = z.object({
  numero: z.string()
    .min(1, 'El número de expediente es requerido')
    .regex(/^\d+\/\d{4}$/, 'Formato inválido. Usá: 12345/2024'),
  caratula: z.string()
    .min(3, 'La carátula debe tener al menos 3 caracteres')
    .max(120, 'La carátula no puede exceder 120 caracteres'),
  fuero: z.enum(['Laboral', 'Civil', 'Comercial', 'Penal', 'Familia', 'Otros'], {
    required_error: 'Seleccioná un fuero'
  }),
  juzgado: z.string().optional(),
  jurisdiccion: z.string().optional(),
  estado: z.enum(['Abierto', 'En trámite', 'Cerrado'], {
    required_error: 'Seleccioná un estado'
  }),
  clienteId: z.string().min(1, 'Seleccioná un cliente'),
  responsables: z.array(z.string()).min(1, 'Seleccioná al menos un responsable'),
  notas: z.string().optional()
});

export const plazoSchema = z.object({
  tipo: z.enum(['Presentación', 'Contestación', 'Oficio', 'Audiencia', 'Otro'], {
    required_error: 'Seleccioná un tipo de plazo'
  }),
  titulo: z.string()
    .min(1, 'El título es requerido')
    .max(100, 'El título no puede exceder 100 caracteres'),
  descripcion: z.string().optional(),
  inicio: z.string().min(1, 'La fecha de inicio es requerida'),
  vence: z.string().min(1, 'La fecha de vencimiento es requerida'),
  todoElDia: z.boolean().default(true),
  prioridad: z.enum(['Alta', 'Media', 'Baja'], {
    required_error: 'Seleccioná una prioridad'
  }),
  estado: z.enum(['Pendiente', 'Hecho', 'Vencido']).default('Pendiente')
}).refine((data) => {
  if (data.inicio && data.vence) {
    return new Date(data.vence) >= new Date(data.inicio);
  }
  return true;
}, {
  message: 'La fecha de vencimiento no puede ser anterior a la de inicio',
  path: ['vence']
});

export const clienteSchema = z.object({
  tipo: z.enum(['persona', 'empresa'], {
    required_error: 'Seleccioná un tipo de cliente'
  }),
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  documento: z.string()
    .min(1, 'El documento es requerido')
    .max(20, 'El documento no puede exceder 20 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional(),
  direccion: z.string().optional()
});

export type ExpedienteFormData = z.infer<typeof expedienteSchema>;
export type PlazoFormData = z.infer<typeof plazoSchema>;
export type ClienteFormData = z.infer<typeof clienteSchema>;
