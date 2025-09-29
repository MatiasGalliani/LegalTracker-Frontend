import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Sidebar, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components';
import NavigationWrapper from './NavigationWrapper';
import { Download, FileText, BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';

export default function Reportes() {
  return (
    <NavigationWrapper>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
              
              {/* Report Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Expedientes
                    </CardTitle>
                    <CardDescription>
                      Reportes de casos y expedientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <p className="text-sm text-gray-600">Expedientes activos</p>
                  </CardContent>
                </Card>
                
                {/* <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Honorarios
                    </CardTitle>
                    <CardDescription>
                      Análisis de ingresos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">$0</div>
                    <p className="text-sm text-gray-600">Este mes</p>
                  </CardContent>
                </Card> */}
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      Plazos
                    </CardTitle>
                    <CardDescription>
                      Vencimientos y fechas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <p className="text-sm text-gray-600">Próximos vencimientos</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Rendimiento
                    </CardTitle>
                    <CardDescription>
                      Métricas generales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">0%</div>
                    <p className="text-sm text-gray-600">Eficiencia</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Filters and Controls */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Filtros de Reporte</CardTitle>
                  <CardDescription>
                    Selecciona los parámetros para generar tu reporte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de Reporte</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expedientes">Expedientes</SelectItem>
                          {/* <SelectItem value="honorarios">Honorarios</SelectItem> */}
                          <SelectItem value="plazos">Plazos</SelectItem>
                          <SelectItem value="audiencias">Audiencias</SelectItem>
                          <SelectItem value="clientes">Clientes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Período</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hoy">Hoy</SelectItem>
                          <SelectItem value="semana">Esta semana</SelectItem>
                          <SelectItem value="mes">Este mes</SelectItem>
                          <SelectItem value="trimestre">Este trimestre</SelectItem>
                          <SelectItem value="año">Este año</SelectItem>
                          <SelectItem value="personalizado">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los estados" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="cerrado">Cerrado</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Formato</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="PDF" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <Button>Generar Reporte</Button>
                    <Button variant="outline">Limpiar Filtros</Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Reportes Recientes</CardTitle>
                  <CardDescription>
                    Historial de reportes generados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="text-gray-500">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>No hay reportes generados</p>
                            <p className="text-sm text-gray-400 mt-1">Los reportes aparecerán aquí cuando los generes</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}
