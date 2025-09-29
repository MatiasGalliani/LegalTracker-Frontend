import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Sidebar, Badge } from '@/components';
import NavigationWrapper from './NavigationWrapper';

export default function Dashboard() {
  return (
    <NavigationWrapper>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expedientes Activos</CardTitle>
                  <CardDescription>
                    Causas en curso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">0</div>
                  <p className="text-sm text-gray-600">Sin expedientes activos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Plazos</CardTitle>
                  <CardDescription>
                    Vencimientos en 7 días
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">0</div>
                  <p className="text-sm text-gray-600">Sin vencimientos próximos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Audiencias</CardTitle>
                  <CardDescription>
                    Esta semana
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">0</div>
                  <p className="text-sm text-gray-600">Sin audiencias programadas</p>
                </CardContent>
              </Card>
              
              {/* <Card>
                <CardHeader>
                  <CardTitle>Facturación Mensual</CardTitle>
                  <CardDescription>
                    Honorarios del mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">$0</div>
                  <p className="text-sm text-gray-600">Sin datos disponibles</p>
                </CardContent>
              </Card> */}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>
                    Herramientas principales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full">Nuevo Expediente</Button>
                  <Button variant="outline" className="w-full">Agregar Cliente</Button>
                  <Button variant="outline" className="w-full">Cargar Plazo</Button>
                  <Button variant="outline" className="w-full">Nueva Audiencia</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expedientes Recientes</CardTitle>
                  <CardDescription>
                    Últimos casos agregados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay expedientes recientes</p>
                    <p className="text-sm text-gray-400 mt-1">Los expedientes aparecerán aquí cuando los agregues</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
    </NavigationWrapper>
  );
}
