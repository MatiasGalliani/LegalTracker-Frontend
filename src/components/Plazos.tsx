'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, isAfter, isBefore, addDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Plus, 
  Search, 
  Filter, 
  X, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  Building2,
  Flag,
  CalendarDays
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Sidebar,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label
} from '@/components';
import { plazosService, expedientesService, clientesService } from '@/services';
import { Plazo, Expediente, Cliente } from '@/types';
import NavigationWrapper from './NavigationWrapper';

export default function Plazos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({
    estado: undefined as string | undefined,
    prioridad: undefined as string | undefined,
    tipo: undefined as string | undefined,
    venceDesde: undefined as string | undefined,
    venceHasta: undefined as string | undefined,
  });
  const [plazoAMarcar, setPlazoAMarcar] = useState<Plazo | null>(null);
  const [plazoAEliminar, setPlazoAEliminar] = useState<Plazo | null>(null);

  const queryClient = useQueryClient();

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch plazos
  const { data: plazos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['plazos'],
    queryFn: () => plazosService.list()
  });

  // Fetch expedientes for display
  const { data: expedientes = [] } = useQuery({
    queryKey: ['expedientes'],
    queryFn: () => expedientesService.list()
  });

  // Fetch clientes for display
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesService.list()
  });

  // Mark plazo as done mutation
  const marcarComoHechoMutation = useMutation({
    mutationFn: (id: string) => plazosService.update(id, { estado: 'Hecho' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plazos'] });
      setPlazoAMarcar(null);
    }
  });

  // Delete plazo mutation
  const eliminarPlazoMutation = useMutation({
    mutationFn: (id: string) => plazosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plazos'] });
      setPlazoAEliminar(null);
    }
  });

  // Get expediente by ID
  const getExpediente = (expedienteId: string): Expediente | undefined => {
    return expedientes.find(e => e.id === expedienteId);
  };

  // Get cliente by ID
  const getCliente = (clienteId: string): Cliente | undefined => {
    return clientes.find(c => c.id === clienteId);
  };

  // Filter and search plazos
  const plazosFiltrados = useMemo(() => {
    let filtered = plazos;

    // Search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(plazo => 
        plazo.titulo.toLowerCase().includes(searchLower) ||
        plazo.descripcion?.toLowerCase().includes(searchLower) ||
        getExpediente(plazo.expedienteId)?.numero.toLowerCase().includes(searchLower) ||
        getExpediente(plazo.expedienteId)?.caratula.toLowerCase().includes(searchLower)
      );
    }

    // Estado filter
    if (filtros.estado) {
      filtered = filtered.filter(plazo => plazo.estado === filtros.estado);
    }

    // Prioridad filter
    if (filtros.prioridad) {
      filtered = filtered.filter(plazo => plazo.prioridad === filtros.prioridad);
    }

    // Tipo filter
    if (filtros.tipo) {
      filtered = filtered.filter(plazo => plazo.tipo === filtros.tipo);
    }

    // Date filters
    if (filtros.venceDesde) {
      filtered = filtered.filter(plazo => 
        isAfter(new Date(plazo.vence), startOfDay(new Date(filtros.venceDesde!)))
      );
    }

    if (filtros.venceHasta) {
      filtered = filtered.filter(plazo => 
        isBefore(new Date(plazo.vence), endOfDay(new Date(filtros.venceHasta!)))
      );
    }

    // Sort by vence date (ascending - closest deadlines first)
    return filtered.sort((a, b) => new Date(a.vence).getTime() - new Date(b.vence).getTime());
  }, [plazos, debouncedSearchTerm, filtros, expedientes]);

  // Get status color
  const getEstadoColor = (estado: string, vence: string) => {
    const now = new Date();
    const venceDate = new Date(vence);
    
    if (estado === 'Hecho') return 'bg-green-100 text-green-800';
    if (estado === 'Vencido') return 'bg-red-100 text-red-800';
    if (isBefore(venceDate, now)) return 'bg-red-100 text-red-800';
    if (isBefore(venceDate, addDays(now, 3))) return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  // Get priority color
  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get tipo color
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Presentación': return 'bg-blue-100 text-blue-800';
      case 'Contestación': return 'bg-purple-100 text-purple-800';
      case 'Oficio': return 'bg-orange-100 text-orange-800';
      case 'Audiencia': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle filter changes
  const handleFiltroChange = (campo: keyof typeof filtros, valor: string | string[] | undefined) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Clear all filters
  const limpiarFiltros = () => {
    setFiltros({
      estado: undefined,
      prioridad: undefined,
      tipo: undefined,
      venceDesde: undefined,
      venceHasta: undefined,
    });
    setSearchTerm('');
  };

  // Handle mark as done
  const handleMarcarComoHecho = (plazo: Plazo) => {
    marcarComoHechoMutation.mutate(plazo.id);
  };

  // Handle delete
  const handleEliminar = (plazo: Plazo) => {
    eliminarPlazoMutation.mutate(plazo.id);
  };

  // Get urgency status
  const getUrgencyStatus = (plazo: Plazo) => {
    const now = new Date();
    const venceDate = new Date(plazo.vence);
    const daysUntil = Math.ceil((venceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (plazo.estado === 'Hecho') return null;
    if (daysUntil < 0) return { text: 'Vencido', icon: AlertTriangle, color: 'text-red-600' };
    if (daysUntil === 0) return { text: 'Hoy', icon: AlertTriangle, color: 'text-red-600' };
    if (daysUntil <= 3) return { text: `${daysUntil} días`, icon: AlertTriangle, color: 'text-orange-600' };
    if (daysUntil <= 7) return { text: `${daysUntil} días`, icon: Clock, color: 'text-yellow-600' };
    return { text: `${daysUntil} días`, icon: Calendar, color: 'text-gray-600' };
  };

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const vencidos = plazos.filter(p => p.estado !== 'Hecho' && isBefore(new Date(p.vence), now)).length;
    const hoy = plazos.filter(p => p.estado !== 'Hecho' && 
      format(new Date(p.vence), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')).length;
    const proximos = plazos.filter(p => p.estado !== 'Hecho' && 
      isAfter(new Date(p.vence), now) && isBefore(new Date(p.vence), addDays(now, 7))).length;
    const hechos = plazos.filter(p => p.estado === 'Hecho').length;
    
    return { vencidos, hoy, proximos, hechos };
  }, [plazos]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Error al cargar plazos
                </h2>
                <p className="text-gray-600 mb-4">
                  {error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
                </p>
                <Button onClick={() => refetch()}>
                  Intentar nuevamente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavigationWrapper>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Plazos</h1>
                <p className="text-gray-600 mt-2">Control de plazos procesales y audiencias</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Plazo
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.vencidos}</div>
                  <p className="text-xs text-muted-foreground">
                    Requieren atención urgente
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hoy</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.hoy}</div>
                  <p className="text-xs text-muted-foreground">
                    Vencen hoy
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próximos 7 días</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.proximos}</div>
                  <p className="text-xs text-muted-foreground">
                    Vencen esta semana
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completados</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.hechos}</div>
                  <p className="text-xs text-muted-foreground">
                    Marcados como hechos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="busqueda">Búsqueda</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="busqueda"
                        placeholder="Título, descripción, expediente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={filtros.estado || undefined}
                      onValueChange={(value) => handleFiltroChange('estado', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Hecho">Hecho</SelectItem>
                        <SelectItem value="Vencido">Vencido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Prioridad */}
                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Select
                      value={filtros.prioridad || undefined}
                      onValueChange={(value) => handleFiltroChange('prioridad', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las prioridades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo */}
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                      value={filtros.tipo || undefined}
                      onValueChange={(value) => handleFiltroChange('tipo', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Presentación">Presentación</SelectItem>
                        <SelectItem value="Contestación">Contestación</SelectItem>
                        <SelectItem value="Oficio">Oficio</SelectItem>
                        <SelectItem value="Audiencia">Audiencia</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fecha vence */}
                  <div className="space-y-2">
                    <Label htmlFor="venceDesde">Vence desde</Label>
                    <Input
                      id="venceDesde"
                      type="date"
                      value={filtros.venceDesde || ''}
                      onChange={(e) => handleFiltroChange('venceDesde', e.target.value || undefined)}
                    />
                  </div>
                </div>

                {/* Active filters */}
                {(Object.values(filtros).some(v => v) || searchTerm) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {searchTerm && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Búsqueda: {searchTerm}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSearchTerm('')}
                        />
                      </Badge>
                    )}
                    {filtros.estado && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Estado: {filtros.estado}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('estado', undefined)}
                        />
                      </Badge>
                    )}
                    {filtros.prioridad && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Prioridad: {filtros.prioridad}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('prioridad', undefined)}
                        />
                      </Badge>
                    )}
                    {filtros.tipo && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Tipo: {filtros.tipo}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('tipo', undefined)}
                        />
                      </Badge>
                    )}
                    {filtros.venceDesde && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Desde: {filtros.venceDesde}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('venceDesde', undefined)}
                        />
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plazos Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Lista de Plazos</CardTitle>
                    <CardDescription>
                      {plazosFiltrados.length} plazos encontrados
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {plazosFiltrados.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron plazos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {Object.values(filtros).some(v => v) || searchTerm
                        ? 'Intentá ajustar los filtros de búsqueda'
                        : 'Creá tu primer plazo para comenzar'
                      }
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo Plazo
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Expediente</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Prioridad</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Vence</TableHead>
                        <TableHead>Urgencia</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plazosFiltrados.map((plazo) => {
                        const expediente = getExpediente(plazo.expedienteId);
                        const cliente = expediente ? getCliente(expediente.clienteId) : undefined;
                        const urgencia = getUrgencyStatus(plazo);
                        
                        return (
                          <TableRow key={plazo.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{expediente?.numero || 'N/A'}</div>
                                <div className="text-sm text-gray-600 max-w-xs truncate">
                                  {expediente?.caratula || 'Expediente no encontrado'}
                                </div>
                                {cliente && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    {cliente.tipo === 'persona' ? (
                                      <User className="mr-1 h-3 w-3" />
                                    ) : (
                                      <Building2 className="mr-1 h-3 w-3" />
                                    )}
                                    {cliente.nombre}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{plazo.titulo}</div>
                                {plazo.descripcion && (
                                  <div className="text-sm text-gray-600 max-w-xs truncate">
                                    {plazo.descripcion}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getTipoColor(plazo.tipo)}>
                                {plazo.tipo}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPrioridadColor(plazo.prioridad)}>
                                <Flag className="mr-1 h-3 w-3" />
                                {plazo.prioridad}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getEstadoColor(plazo.estado, plazo.vence)}>
                                {plazo.estado === 'Hecho' ? (
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                ) : (
                                  <Clock className="mr-1 h-3 w-3" />
                                )}
                                {plazo.estado}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {format(new Date(plazo.vence), 'dd/MM/yyyy', { locale: es })}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {format(new Date(plazo.vence), 'HH:mm', { locale: es })}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {urgencia && (
                                <div className={`flex items-center text-sm ${urgencia.color}`}>
                                  <urgencia.icon className="mr-1 h-4 w-4" />
                                  {urgencia.text}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                {plazo.estado !== 'Hecho' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleMarcarComoHecho(plazo)}
                                    disabled={marcarComoHechoMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setPlazoAEliminar(plazo)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mark as Done Confirmation Dialog */}
      <Dialog open={!!plazoAMarcar} onOpenChange={() => setPlazoAMarcar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como Hecho</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés marcar este plazo como completado?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlazoAMarcar(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => plazoAMarcar && handleMarcarComoHecho(plazoAMarcar)}
              disabled={marcarComoHechoMutation.isPending}
            >
              {marcarComoHechoMutation.isPending ? 'Marcando...' : 'Marcar como Hecho'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!plazoAEliminar} onOpenChange={() => setPlazoAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Plazo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés eliminar este plazo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlazoAEliminar(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => plazoAEliminar && handleEliminar(plazoAEliminar)}
              disabled={eliminarPlazoMutation.isPending}
            >
              {eliminarPlazoMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </NavigationWrapper>
  );
}
