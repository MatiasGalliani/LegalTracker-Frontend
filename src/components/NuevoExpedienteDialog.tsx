'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from '@/components';
import { expedientesService, clientesService } from '@/services';
import { expedienteSchema, ExpedienteFormData } from '@/lib/schemas';
import { Expediente } from '@/types';

interface NuevoExpedienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NuevoExpedienteDialog({ open, onOpenChange }: NuevoExpedienteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ExpedienteFormData>({
    resolver: zodResolver(expedienteSchema),
    defaultValues: {
      numero: '',
      caratula: '',
      fuero: undefined,
      juzgado: '',
      jurisdiccion: '',
      estado: 'Abierto',
      clienteId: '',
      responsables: [],
      notas: ''
    }
  });

  // Fetch clientes for the select
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesService.list()
  });

  // Mutation for creating expediente
  const createExpedienteMutation = useMutation({
    mutationFn: expedientesService.create,
    onSuccess: () => {
      // Invalidate and refetch expedientes
      queryClient.invalidateQueries({ queryKey: ['expedientes'] });
      reset();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error al crear expediente:', error);
    }
  });

  const onSubmit = async (data: ExpedienteFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API call - exclude id, creadoEn, actualizadoEn
      const expedienteData = {
        numero: data.numero,
        caratula: data.caratula,
        fuero: data.fuero,
        juzgado: data.juzgado || undefined,
        jurisdiccion: data.jurisdiccion || undefined,
        estado: data.estado,
        clienteId: data.clienteId,
        responsables: data.responsables,
        notas: data.notas || undefined
      };
      
      await createExpedienteMutation.mutateAsync(expedienteData);
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const selectedClienteId = watch('clienteId');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90vh] overflow-y-auto"
        style={{
          width: '90vw',
          maxWidth: 'none'
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Expediente
          </DialogTitle>
          <DialogDescription>
            Creá un nuevo expediente judicial con toda la información necesaria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Número de expediente */}
              <div className="space-y-2">
                <Label htmlFor="numero">Número de Expediente *</Label>
                <Input
                  id="numero"
                  placeholder="12345/2024"
                  {...register('numero')}
                  className={errors.numero ? 'border-red-500' : ''}
                />
                {errors.numero && (
                  <p className="text-sm text-red-500">{errors.numero.message}</p>
                )}
              </div>

              {/* Fuero */}
              <div className="space-y-2">
                <Label htmlFor="fuero">Fuero *</Label>
                <Select
                  value={watch('fuero')}
                  onValueChange={(value) => setValue('fuero', value as any)}
                >
                  <SelectTrigger className={errors.fuero ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccioná un fuero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laboral">Laboral</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Penal">Penal</SelectItem>
                    <SelectItem value="Familia">Familia</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fuero && (
                  <p className="text-sm text-red-500">{errors.fuero.message}</p>
                )}
              </div>

              {/* Carátula */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="caratula">Carátula *</Label>
                <Input
                  id="caratula"
                  placeholder="Ej: González, Juan c/ Empresa XYZ s/ Despido"
                  {...register('caratula')}
                  className={errors.caratula ? 'border-red-500' : ''}
                />
                {errors.caratula && (
                  <p className="text-sm text-red-500">{errors.caratula.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información judicial */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Judicial</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Juzgado */}
              <div className="space-y-2">
                <Label htmlFor="juzgado">Juzgado</Label>
                <Input
                  id="juzgado"
                  placeholder="Ej: Juzgado Laboral N° 1"
                  {...register('juzgado')}
                />
              </div>

              {/* Jurisdicción */}
              <div className="space-y-2">
                <Label htmlFor="jurisdiccion">Jurisdicción</Label>
                <Select
                  value={watch('jurisdiccion')}
                  onValueChange={(value) => setValue('jurisdiccion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná una jurisdicción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CABA">CABA</SelectItem>
                    <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                    <SelectItem value="Córdoba">Córdoba</SelectItem>
                    <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                    <SelectItem value="Mendoza">Mendoza</SelectItem>
                    <SelectItem value="Tucumán">Tucumán</SelectItem>
                    <SelectItem value="Salta">Salta</SelectItem>
                    <SelectItem value="Entre Ríos">Entre Ríos</SelectItem>
                    <SelectItem value="Misiones">Misiones</SelectItem>
                    <SelectItem value="Corrientes">Corrientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select
                  value={watch('estado')}
                  onValueChange={(value) => setValue('estado', value as any)}
                >
                  <SelectTrigger className={errors.estado ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccioná un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Abierto">Abierto</SelectItem>
                    <SelectItem value="En trámite">En trámite</SelectItem>
                    <SelectItem value="Cerrado">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.estado && (
                  <p className="text-sm text-red-500">{errors.estado.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cliente</h3>
            
            <div className="space-y-2">
              <Label htmlFor="clienteId">Cliente *</Label>
              <Select
                value={selectedClienteId}
                onValueChange={(value) => setValue('clienteId', value)}
              >
                <SelectTrigger className={errors.clienteId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccioná un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} ({cliente.tipo === 'persona' ? 'Persona' : 'Empresa'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clienteId && (
                <p className="text-sm text-red-500">{errors.clienteId.message}</p>
              )}
              {clientes.length === 0 && (
                <p className="text-sm text-amber-600">
                  No hay clientes disponibles. Creá un cliente primero.
                </p>
              )}
            </div>
          </div>

          {/* Responsables */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Responsables</h3>
            
            <div className="space-y-2">
              <Label>Responsables del expediente</Label>
              <div className="text-sm text-gray-600">
                Por ahora se asignará automáticamente al usuario actual
              </div>
              {/* TODO: Implementar selección de responsables cuando tengamos usuarios */}
              <div className="text-xs text-gray-500">
                Nota: La funcionalidad de selección de responsables estará disponible próximamente.
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Adicional</h3>
            
            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                placeholder="Observaciones, comentarios o información adicional sobre el expediente..."
                rows={3}
                {...register('notas')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || clientes.length === 0}
            >
              {isSubmitting ? 'Creando...' : 'Crear Expediente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
