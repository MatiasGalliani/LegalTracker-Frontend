'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isTomorrow } from 'date-fns';
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
  MapPin,
  User,
  Building2,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
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
import { audienciasService, expedientesService } from '@/services';
import { Audiencia, FiltrosAudiencias, OrdenAudiencias } from '@/types';
import NavigationWrapper from './NavigationWrapper';

export default function Audiencias() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltrosAudiencias>({});
  const [orden, setOrden] = useState<OrdenAudiencias>({ campo: 'fecha', direccion: 'asc' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamañoPagina, setTamañoPagina] = useState(10);
  const [audienciaAEliminar, setAudienciaAEliminar] = useState<Audiencia | null>(null);
  const [vistaActual, setVistaActual] = useState<'tabla' | 'calendario'>('tabla');
  const [fechaCalendario, setFechaCalendario] = useState(new Date());

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Debounce search term
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update filters with debounced search
  const filtrosActualizados = useMemo(() => ({
    ...filtros,
    busqueda: debouncedSearchTerm || undefined
  }), [filtros, debouncedSearchTerm]);

  // Fetch audiencias
  const { data: audiencias = [], isLoading, error, refetch } = useQuery({
    queryKey: ['audiencias', filtrosActualizados, orden],
    queryFn: () => audienciasService.list(filtrosActualizados, orden)
  });

  // Fetch expedientes for display
  const { data: expedientes = [] } = useQuery({
    queryKey: ['expedientes'],
    queryFn: () => expedientesService.list()
  });

  // Pagination
  const totalPaginas = Math.ceil(audiencias.length / tamañoPagina);
  const audienciasPaginados = audiencias.slice(
    (paginaActual - 1) * tamañoPagina,
    paginaActual * tamañoPagina
  );

  // Get expediente info by ID
  const getExpedienteInfo = (expedienteId: string) => {
    const expediente = expedientes.find(e => e.id === expedienteId);
    return expediente ? { numero: expediente.numero, caratula: expediente.caratula } : null;
  };

  // Estado colors
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Programada': return 'bg-blue-100 text-blue-800';
      case 'En curso': return 'bg-yellow-100 text-yellow-800';
      case 'Realizada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'Aplazada': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Tipo colors
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Audiencia Preliminar': return 'bg-purple-100 text-purple-800';
      case 'Mediación': return 'bg-indigo-100 text-indigo-800';
      case 'Conciliación': return 'bg-cyan-100 text-cyan-800';
      case 'Vista': return 'bg-teal-100 text-teal-800';
      case 'Sentencia': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle filter changes
  const handleFiltroChange = (campo: keyof FiltrosAudiencias, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
    setPaginaActual(1);
  };

  // Clear all filters
  const limpiarFiltros = () => {
    setFiltros({});
    setSearchTerm('');
    setPaginaActual(1);
  };

  // Handle sort
  const handleSort = (campo: OrdenAudiencias['campo']) => {
    setOrden(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle delete
  const handleDelete = async (audiencia: Audiencia) => {
    try {
      await audienciasService.delete(audiencia.id);
      refetch();
      setAudienciaAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar audiencia:', error);
    }
  };

  // Calendar functions
  const startOfWeekDate = startOfWeek(fechaCalendario, { weekStartsOn: 1 }); // Monday
  const endOfWeekDate = endOfWeek(fechaCalendario, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i));
  
  const audienciasPorDia = useMemo(() => {
    const audienciasPorDia: { [key: string]: Audiencia[] } = {};
    audiencias.forEach(audiencia => {
      const fecha = audiencia.fecha;
      if (!audienciasPorDia[fecha]) {
        audienciasPorDia[fecha] = [];
      }
      audienciasPorDia[fecha].push(audiencia);
    });
    return audienciasPorDia;
  }, [audiencias]);

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
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Error al cargar audiencias
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
                <h1 className="text-3xl font-bold text-gray-900">Audiencias</h1>
                <p className="text-gray-600 mt-2">Gestión de audiencias judiciales</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={vistaActual === 'tabla' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVistaActual('tabla')}
                  >
                    Tabla
                  </Button>
                  <Button
                    variant={vistaActual === 'calendario' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVistaActual('calendario')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Calendario
                  </Button>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Audiencia
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Audiencias</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{audiencias.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {audiencias.filter(a => a.estado === 'Programada').length} programadas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {audiencias.filter(a => {
                      const fecha = new Date(a.fecha);
                      const hoy = new Date();
                      const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 });
                      const finSemana = endOfWeek(hoy, { weekStartsOn: 1 });
                      return fecha >= inicioSemana && fecha <= finSemana;
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Próximas audiencias
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hoy</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {audiencias.filter(a => isToday(new Date(a.fecha))).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Audiencias de hoy
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Realizadas</CardTitle>
                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {audiencias.filter(a => a.estado === 'Realizada').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Completadas
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="busqueda">Búsqueda</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="busqueda"
                        placeholder="Título, juzgado, juez..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Tipo */}
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                      value={filtros.tipo?.[0] || undefined}
                      onValueChange={(value) => 
                        handleFiltroChange('tipo', value ? [value] : undefined)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Audiencia Preliminar">Audiencia Preliminar</SelectItem>
                        <SelectItem value="Mediación">Mediación</SelectItem>
                        <SelectItem value="Conciliación">Conciliación</SelectItem>
                        <SelectItem value="Vista">Vista</SelectItem>
                        <SelectItem value="Sentencia">Sentencia</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={filtros.estado?.[0] || undefined}
                      onValueChange={(value) => 
                        handleFiltroChange('estado', value ? [value] : undefined)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Programada">Programada</SelectItem>
                        <SelectItem value="En curso">En curso</SelectItem>
                        <SelectItem value="Realizada">Realizada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                        <SelectItem value="Aplazada">Aplazada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Juzgado */}
                  <div className="space-y-2">
                    <Label htmlFor="juzgado">Juzgado</Label>
                    <Select
                      value={filtros.juzgado?.[0] || undefined}
                      onValueChange={(value) => 
                        handleFiltroChange('juzgado', value ? [value] : undefined)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los juzgados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Juzgado Laboral N° 1">Juzgado Laboral N° 1</SelectItem>
                        <SelectItem value="Juzgado Comercial N° 2">Juzgado Comercial N° 2</SelectItem>
                        <SelectItem value="Juzgado de Familia N° 1">Juzgado de Familia N° 1</SelectItem>
                        <SelectItem value="Juzgado Civil N° 2">Juzgado Civil N° 2</SelectItem>
                        <SelectItem value="Juzgado Civil N° 3">Juzgado Civil N° 3</SelectItem>
                        <SelectItem value="Juzgado Penal N° 1">Juzgado Penal N° 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active filters */}
                {(Object.keys(filtros).length > 0 || searchTerm) && (
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
                    {filtros.tipo && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Tipo: {filtros.tipo.join(', ')}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('tipo', undefined)}
                        />
                      </Badge>
                    )}
                    {filtros.estado && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Estado: {filtros.estado.join(', ')}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('estado', undefined)}
                        />
                      </Badge>
                    )}
                    {filtros.juzgado && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Juzgado: {filtros.juzgado.join(', ')}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('juzgado', undefined)}
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

            {/* Content based on view */}
            {vistaActual === 'tabla' ? (
              /* Table View */
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Lista de Audiencias</CardTitle>
                      <CardDescription>
                        {audiencias.length} audiencias encontradas
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="tamaño-pagina">Mostrar:</Label>
                      <Select
                        value={tamañoPagina.toString()}
                        onValueChange={(value) => {
                          setTamañoPagina(Number(value));
                          setPaginaActual(1);
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {audienciasPaginados.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron audiencias
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {Object.keys(filtrosActualizados).length > 0 
                          ? 'Intentá ajustar los filtros de búsqueda'
                          : 'Creá tu primera audiencia para comenzar'
                        }
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Audiencia
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('fecha')}
                            >
                              Fecha {orden.campo === 'fecha' && (orden.direccion === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('titulo')}
                            >
                              Título {orden.campo === 'titulo' && (orden.direccion === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>Expediente</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Juzgado</TableHead>
                            <TableHead>Hora</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {audienciasPaginados.map((audiencia) => {
                            const expedienteInfo = getExpedienteInfo(audiencia.expedienteId);
                            return (
                              <TableRow key={audiencia.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                    {format(new Date(audiencia.fecha), 'dd/MM/yyyy', { locale: es })}
                                    {isToday(new Date(audiencia.fecha)) && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        Hoy
                                      </Badge>
                                    )}
                                    {isTomorrow(new Date(audiencia.fecha)) && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        Mañana
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {audiencia.titulo}
                                </TableCell>
                                <TableCell>
                                  {expedienteInfo ? (
                                    <div>
                                      <div className="font-medium text-sm">{expedienteInfo.numero}</div>
                                      <div className="text-xs text-gray-500 truncate max-w-32">
                                        {expedienteInfo.caratula}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">Expediente no encontrado</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getTipoColor(audiencia.tipo)}>
                                    {audiencia.tipo}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{audiencia.juzgado || '-'}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                    {audiencia.hora}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getEstadoColor(audiencia.estado)}>
                                    {audiencia.estado}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setAudienciaAEliminar(audiencia)}
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

                      {/* Pagination */}
                      {totalPaginas > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-gray-700">
                            Mostrando {((paginaActual - 1) * tamañoPagina) + 1} a {Math.min(paginaActual * tamañoPagina, audiencias.length)} de {audiencias.length} audiencias
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                              disabled={paginaActual === 1}
                            >
                              Anterior
                            </Button>
                            {[...Array(totalPaginas)].map((_, i) => (
                              <Button
                                key={i + 1}
                                variant={paginaActual === i + 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPaginaActual(i + 1)}
                              >
                                {i + 1}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                              disabled={paginaActual === totalPaginas}
                            >
                              Siguiente
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Calendar View */
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Vista de Calendario</CardTitle>
                      <CardDescription>
                        {format(fechaCalendario, 'MMMM yyyy', { locale: es })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFechaCalendario(addDays(fechaCalendario, -7))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFechaCalendario(new Date())}
                      >
                        Hoy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFechaCalendario(addDays(fechaCalendario, 7))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day, index) => {
                      const dayStr = format(day, 'yyyy-MM-dd');
                      const dayAudiencias = audienciasPorDia[dayStr] || [];
                      const isCurrentDay = isToday(day);
                      const isOtherMonth = day.getMonth() !== fechaCalendario.getMonth();
                      
                      return (
                        <div
                          key={dayStr}
                          className={`min-h-24 p-2 border rounded-lg ${
                            isCurrentDay 
                              ? 'bg-blue-50 border-blue-200' 
                              : isOtherMonth 
                                ? 'bg-gray-50 text-gray-400' 
                                : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-medium ${
                              isCurrentDay ? 'text-blue-600' : isOtherMonth ? 'text-gray-400' : 'text-gray-900'
                            }`}>
                              {format(day, 'd')}
                            </span>
                            {dayAudiencias.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {dayAudiencias.length}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            {dayAudiencias.slice(0, 2).map((audiencia) => (
                              <div
                                key={audiencia.id}
                                className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate cursor-pointer hover:bg-blue-200"
                                title={audiencia.titulo}
                              >
                                {audiencia.hora} - {audiencia.titulo}
                              </div>
                            ))}
                            {dayAudiencias.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayAudiencias.length - 2} más
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!audienciaAEliminar} onOpenChange={() => setAudienciaAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Audiencia</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés eliminar la audiencia "{audienciaAEliminar?.titulo}"? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAudienciaAEliminar(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => audienciaAEliminar && handleDelete(audienciaAEliminar)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </NavigationWrapper>
  );
}
