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
  DollarSign,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Building2,
  CreditCard,
  Banknote,
  Receipt,
  TrendingUp,
  TrendingDown,
  Minus
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
import { honorariosService, expedientesService, clientesService } from '@/services';
import { Honorario, FiltrosHonorarios, OrdenHonorarios } from '@/types';
import NavigationWrapper from './NavigationWrapper';

export default function Honorarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltrosHonorarios>({});
  const [orden, setOrden] = useState<OrdenHonorarios>({ campo: 'fechaServicio', direccion: 'desc' });
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamañoPagina, setTamañoPagina] = useState(10);
  const [honorarioAEliminar, setHonorarioAEliminar] = useState<Honorario | null>(null);

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

  // Fetch honorarios
  const { data: honorarios = [], isLoading, error, refetch } = useQuery({
    queryKey: ['honorarios', filtrosActualizados, orden],
    queryFn: () => honorariosService.list(filtrosActualizados, orden)
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['honorarios-stats'],
    queryFn: () => honorariosService.getStats()
  });

  // Fetch expedientes and clientes for display
  const { data: expedientes = [] } = useQuery({
    queryKey: ['expedientes'],
    queryFn: () => expedientesService.list()
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesService.list()
  });

  // Pagination
  const totalPaginas = Math.ceil(honorarios.length / tamañoPagina);
  const honorariosPaginados = honorarios.slice(
    (paginaActual - 1) * tamañoPagina,
    paginaActual * tamañoPagina
  );

  // Get expediente and cliente info by ID
  const getExpedienteInfo = (expedienteId: string) => {
    const expediente = expedientes.find(e => e.id === expedienteId);
    return expediente ? { numero: expediente.numero, caratula: expediente.caratula } : null;
  };

  const getClienteInfo = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? { nombre: cliente.nombre, tipo: cliente.tipo } : null;
  };

  // Estado colors
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Facturado': return 'bg-blue-100 text-blue-800';
      case 'Cobrado': return 'bg-green-100 text-green-800';
      case 'Vencido': return 'bg-red-100 text-red-800';
      case 'Cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Tipo colors
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Honorarios': return 'bg-blue-100 text-blue-800';
      case 'Gastos': return 'bg-orange-100 text-orange-800';
      case 'Honorarios + Gastos': return 'bg-purple-100 text-purple-800';
      case 'Anticipo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Moneda colors
  const getMonedaColor = (moneda: string) => {
    switch (moneda) {
      case 'ARS': return 'bg-green-100 text-green-800';
      case 'USD': return 'bg-blue-100 text-blue-800';
      case 'EUR': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle filter changes
  const handleFiltroChange = (campo: keyof FiltrosHonorarios, valor: string | string[] | number | undefined) => {
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
  const handleSort = (campo: OrdenHonorarios['campo']) => {
    setOrden(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle delete
  const handleDelete = async (honorario: Honorario) => {
    try {
      await honorariosService.delete(honorario.id);
      refetch();
      setHonorarioAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar honorario:', error);
    }
  };

  // Format currency
  const formatCurrency = (monto: number, moneda: string) => {
    const symbols = { ARS: '$', USD: 'US$', EUR: '€' };
    return `${symbols[moneda as keyof typeof symbols] || '$'} ${monto.toLocaleString()}`;
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
                  Error al cargar honorarios
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
                  <h1 className="text-3xl font-bold text-gray-900">Honorarios</h1>
                  <p className="text-gray-600 mt-2">Gestión de honorarios y facturación</p>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Honorario
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Honorarios</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(stats?.montoTotal || 0, 'ARS')} total
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats?.pendientes || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(stats?.montoPendiente || 0, 'ARS')} por cobrar
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Facturados</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats?.facturados || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enviados a clientes
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cobrados</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {stats?.cobrados || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(stats?.montoCobrado || 0, 'ARS')} cobrado
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
                          placeholder="Concepto, factura, observaciones..."
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
                          <SelectItem value="Honorarios">Honorarios</SelectItem>
                          <SelectItem value="Gastos">Gastos</SelectItem>
                          <SelectItem value="Honorarios + Gastos">Honorarios + Gastos</SelectItem>
                          <SelectItem value="Anticipo">Anticipo</SelectItem>
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
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="Facturado">Facturado</SelectItem>
                          <SelectItem value="Cobrado">Cobrado</SelectItem>
                          <SelectItem value="Vencido">Vencido</SelectItem>
                          <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cliente */}
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Cliente</Label>
                      <Select
                        value={filtros.clienteId?.[0] || undefined}
                        onValueChange={(value) => 
                          handleFiltroChange('clienteId', value ? [value] : undefined)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los clientes" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.map(cliente => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nombre}
                            </SelectItem>
                          ))}
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
                      {filtros.clienteId && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Cliente: {filtros.clienteId.map(id => {
                            const cliente = clientes.find(c => c.id === id);
                            return cliente?.nombre;
                          }).join(', ')}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleFiltroChange('clienteId', undefined)}
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

              {/* Honorarios Table */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Lista de Honorarios</CardTitle>
                      <CardDescription>
                        {honorarios.length} honorarios encontrados
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
                  {honorariosPaginados.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron honorarios
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {Object.keys(filtrosActualizados).length > 0 
                          ? 'Intentá ajustar los filtros de búsqueda'
                          : 'Creá tu primer honorario para comenzar'
                        }
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Honorario
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('fechaServicio')}
                            >
                              Fecha {orden.campo === 'fechaServicio' && (orden.direccion === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('concepto')}
                            >
                              Concepto {orden.campo === 'concepto' && (orden.direccion === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Expediente</TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('monto')}
                            >
                              Monto {orden.campo === 'monto' && (orden.direccion === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('estado')}
                            >
                              Estado {orden.campo === 'estado' && (orden.direccion === 'asc' ? '↑' : '↓')}
                            </TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {honorariosPaginados.map((honorario) => {
                            const expedienteInfo = getExpedienteInfo(honorario.expedienteId);
                            const clienteInfo = getClienteInfo(honorario.clienteId);
                            return (
                              <TableRow key={honorario.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                    {format(new Date(honorario.fechaServicio), 'dd/MM/yyyy', { locale: es })}
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                  <div>
                                    <div className="font-medium truncate">{honorario.concepto}</div>
                                    {honorario.descripcion && (
                                      <div className="text-sm text-gray-500 truncate">
                                        {honorario.descripcion}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {clienteInfo ? (
                                    <div className="flex items-center">
                                      {clienteInfo.tipo === 'persona' ? (
                                        <User className="mr-2 h-4 w-4 text-gray-400" />
                                      ) : (
                                        <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                                      )}
                                      <span className="text-sm">{clienteInfo.nombre}</span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">Cliente no encontrado</span>
                                  )}
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
                                  <div className="flex items-center">
                                    <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                                    <div>
                                      <div className="font-medium">
                                        {formatCurrency(honorario.monto, honorario.moneda)}
                                      </div>
                                      <Badge className={getMonedaColor(honorario.moneda)} variant="outline">
                                        {honorario.moneda}
                                      </Badge>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getTipoColor(honorario.tipo)}>
                                    {honorario.tipo}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getEstadoColor(honorario.estado)}>
                                    {honorario.estado}
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
                                      onClick={() => setHonorarioAEliminar(honorario)}
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
                            Mostrando {((paginaActual - 1) * tamañoPagina) + 1} a {Math.min(paginaActual * tamañoPagina, honorarios.length)} de {honorarios.length} honorarios
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
        <Dialog open={!!honorarioAEliminar} onOpenChange={() => setHonorarioAEliminar(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Honorario</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que querés eliminar el honorario &quot;{honorarioAEliminar?.concepto}&quot;? 
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHonorarioAEliminar(null)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => honorarioAEliminar && handleDelete(honorarioAEliminar)}
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
