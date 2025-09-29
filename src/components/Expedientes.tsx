'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
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
  FileText,
  Building2,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Archive
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
import { expedientesService, clientesService } from '@/services';
import { Expediente, FiltrosExpedientes, OrdenExpedientes } from '@/types';
import NavigationWrapper from './NavigationWrapper';
import NuevoExpedienteDialog from './NuevoExpedienteDialog';

export default function Expedientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltrosExpedientes>({});
  const [orden, setOrden] = useState<OrdenExpedientes>({ campo: 'actualizadoEn', direccion: 'desc' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamañoPagina, setTamañoPagina] = useState(10);
  const [expedienteAEliminar, setExpedienteAEliminar] = useState<Expediente | null>(null);
  const [nuevoExpedienteOpen, setNuevoExpedienteOpen] = useState(false);

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

  // Fetch expedientes
  const { data: expedientes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['expedientes', filtrosActualizados, orden],
    queryFn: () => expedientesService.list(filtrosActualizados, orden)
  });

  // Fetch clientes for display
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesService.list()
  });

  // Pagination
  const totalPaginas = Math.ceil(expedientes.length / tamañoPagina);
  const expedientesPaginados = expedientes.slice(
    (paginaActual - 1) * tamañoPagina,
    paginaActual * tamañoPagina
  );

  // Get cliente name by ID
  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || 'Cliente no encontrado';
  };

  // Estado colors
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Abierto': return 'bg-green-100 text-green-800';
      case 'En trámite': return 'bg-yellow-100 text-yellow-800';
      case 'Cerrado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fuero colors
  const getFueroColor = (fuero: string) => {
    switch (fuero) {
      case 'Laboral': return 'bg-blue-100 text-blue-800';
      case 'Civil': return 'bg-purple-100 text-purple-800';
      case 'Comercial': return 'bg-orange-100 text-orange-800';
      case 'Penal': return 'bg-red-100 text-red-800';
      case 'Familia': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle filter changes
  const handleFiltroChange = (campo: keyof FiltrosExpedientes, valor: string | string[] | undefined) => {
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
  const handleSort = (campo: OrdenExpedientes['campo']) => {
    setOrden(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Handle delete
  const handleDelete = async (expediente: Expediente) => {
    try {
      await expedientesService.delete(expediente.id);
      refetch();
      setExpedienteAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar expediente:', error);
    }
  };

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
                  Error al cargar expedientes
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
                <h1 className="text-3xl font-bold text-gray-900">Expedientes</h1>
                <p className="text-gray-600 mt-2">Gestión de casos judiciales</p>
              </div>
              <Button onClick={() => setNuevoExpedienteOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Expediente
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expedientes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expedientes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {expedientes.filter(e => e.estado === 'Abierto').length} abiertos
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Trámite</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {expedientes.filter(e => e.estado === 'En trámite').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Casos activos
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cerrados</CardTitle>
                  <Archive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {expedientes.filter(e => e.estado === 'Cerrado').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Casos finalizados
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {expedientes.filter(e => 
                      new Date(e.creadoEn).getMonth() === new Date().getMonth()
                    ).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Nuevos casos
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
                        placeholder="Número, carátula, cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Fuero */}
                  <div className="space-y-2">
                    <Label htmlFor="fuero">Fuero</Label>
                    <Select
                      value={filtros.fuero?.[0] || undefined}
                      onValueChange={(value) => 
                        handleFiltroChange('fuero', value ? [value] : undefined)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los fueros" />
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
                        <SelectItem value="Abierto">Abierto</SelectItem>
                        <SelectItem value="En trámite">En trámite</SelectItem>
                        <SelectItem value="Cerrado">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Jurisdicción */}
                  <div className="space-y-2">
                    <Label htmlFor="jurisdiccion">Jurisdicción</Label>
                    <Select
                      value={filtros.jurisdiccion?.[0] || undefined}
                      onValueChange={(value) => 
                        handleFiltroChange('jurisdiccion', value ? [value] : undefined)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las jurisdicciones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CABA">CABA</SelectItem>
                        <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                        <SelectItem value="Córdoba">Córdoba</SelectItem>
                        <SelectItem value="Santa Fe">Santa Fe</SelectItem>
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
                    {filtros.fuero && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Fuero: {filtros.fuero.join(', ')}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('fuero', undefined)}
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
                    {filtros.jurisdiccion && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Jurisdicción: {filtros.jurisdiccion.join(', ')}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFiltroChange('jurisdiccion', undefined)}
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

            {/* Expedientes Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Lista de Expedientes</CardTitle>
                    <CardDescription>
                      {expedientes.length} expedientes encontrados
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
                {expedientesPaginados.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron expedientes
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {Object.keys(filtrosActualizados).length > 0 
                        ? 'Intentá ajustar los filtros de búsqueda'
                        : 'Creá tu primer expediente para comenzar'
                      }
                    </p>
                    <Button onClick={() => setNuevoExpedienteOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nuevo Expediente
                    </Button>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort('numero')}
                          >
                            Número {orden.campo === 'numero' && (orden.direccion === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort('caratula')}
                          >
                            Carátula {orden.campo === 'caratula' && (orden.direccion === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort('cliente')}
                          >
                            Cliente {orden.campo === 'cliente' && (orden.direccion === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead>Fuero</TableHead>
                          <TableHead>Juzgado</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSort('actualizadoEn')}
                          >
                            Actualizado {orden.campo === 'actualizadoEn' && (orden.direccion === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expedientesPaginados.map((expediente) => (
                          <TableRow key={expediente.id}>
                            <TableCell className="font-medium">
                              {expediente.numero}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {expediente.caratula}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-gray-400" />
                                {getClienteNombre(expediente.clienteId)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getFueroColor(expediente.fuero)}>
                                {expediente.fuero}
                              </Badge>
                            </TableCell>
                            <TableCell>{expediente.juzgado || '-'}</TableCell>
                            <TableCell>
                              <Badge className={getEstadoColor(expediente.estado)}>
                                {expediente.estado}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(expediente.actualizadoEn), 'dd/MM/yyyy HH:mm', { locale: es })}
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
                                  onClick={() => setExpedienteAEliminar(expediente)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalPaginas > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-700">
                          Mostrando {((paginaActual - 1) * tamañoPagina) + 1} a {Math.min(paginaActual * tamañoPagina, expedientes.length)} de {expedientes.length} expedientes
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
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!expedienteAEliminar} onOpenChange={() => setExpedienteAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Expediente</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés eliminar el expediente &quot;{expedienteAEliminar?.numero}&quot;? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpedienteAEliminar(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => expedienteAEliminar && handleDelete(expedienteAEliminar)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nuevo Expediente Dialog */}
      <NuevoExpedienteDialog 
        open={nuevoExpedienteOpen} 
        onOpenChange={setNuevoExpedienteOpen} 
      />
    </div>
    </NavigationWrapper>
  );
}
