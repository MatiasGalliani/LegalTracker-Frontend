'use client';

import { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  Check,
  X
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
  Label,
  Separator,
  Badge
} from '@/components';
import NavigationWrapper from './NavigationWrapper';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Perfil
    nombre: '',
    email: '',
    telefono: '',
    especialidad: '',
    matricula: '',
    
    // Notificaciones
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderEmails: true,
    deadlineAlerts: true,
    
    // Seguridad
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    
    // Apariencia
    theme: 'light',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Sistema
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: '5',
    apiAccess: false
  });

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
    { id: 'apariencia', label: 'Apariencia', icon: Palette },
    { id: 'sistema', label: 'Sistema', icon: Database },
  ];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings);
    // Show success message
  };

  const renderPerfilTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Actualiza tu información personal y profesional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={settings.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={settings.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="especialidad">Especialidad</Label>
              <Input
                id="especialidad"
                value={settings.especialidad}
                onChange={(e) => handleInputChange('especialidad', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula Profesional</Label>
            <Input
              id="matricula"
              value={settings.matricula}
              onChange={(e) => handleInputChange('matricula', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificacionesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de Notificaciones</CardTitle>
          <CardDescription>
            Configura cómo y cuándo recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-gray-600">Recibir notificaciones importantes por correo</p>
              </div>
              <Button
                variant={settings.emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('emailNotifications', !settings.emailNotifications)}
              >
                {settings.emailNotifications ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones SMS</Label>
                <p className="text-sm text-gray-600">Recibir alertas críticas por mensaje de texto</p>
              </div>
              <Button
                variant={settings.smsNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('smsNotifications', !settings.smsNotifications)}
              >
                {settings.smsNotifications ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones Push</Label>
                <p className="text-sm text-gray-600">Recibir notificaciones en el navegador</p>
              </div>
              <Button
                variant={settings.pushNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('pushNotifications', !settings.pushNotifications)}
              >
                {settings.pushNotifications ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Recordatorios por Email</Label>
                <p className="text-sm text-gray-600">Enviar recordatorios de plazos y audiencias</p>
              </div>
              <Button
                variant={settings.reminderEmails ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('reminderEmails', !settings.reminderEmails)}
              >
                {settings.reminderEmails ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas de Vencimiento</Label>
                <p className="text-sm text-gray-600">Notificar sobre plazos próximos a vencer</p>
              </div>
              <Button
                variant={settings.deadlineAlerts ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('deadlineAlerts', !settings.deadlineAlerts)}
              >
                {settings.deadlineAlerts ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSeguridadTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Seguridad</CardTitle>
          <CardDescription>
            Gestiona la seguridad de tu cuenta y datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cambiar Contraseña</Label>
              <div className="flex gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Autenticación de Dos Factores</Label>
                <p className="text-sm text-gray-600">Añade una capa extra de seguridad</p>
              </div>
              <Button
                variant={settings.twoFactorAuth ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('twoFactorAuth', !settings.twoFactorAuth)}
              >
                {settings.twoFactorAuth ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
              <select
                id="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
                <option value="480">8 horas</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
              <select
                id="passwordExpiry"
                value={settings.passwordExpiry}
                onChange={(e) => handleInputChange('passwordExpiry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30">30 días</option>
                <option value="60">60 días</option>
                <option value="90">90 días</option>
                <option value="180">6 meses</option>
                <option value="365">1 año</option>
                <option value="0">Nunca</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAparienciaTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalización de Apariencia</CardTitle>
          <CardDescription>
            Personaliza la interfaz según tus preferencias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Formato de Fecha</Label>
              <select
                id="dateFormat"
                value={settings.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Formato de Hora</Label>
              <select
                id="timeFormat"
                value={settings.timeFormat}
                onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">24 horas</option>
                <option value="12h">12 horas (AM/PM)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSistemaTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
          <CardDescription>
            Configuraciones avanzadas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Respaldo Automático</Label>
                <p className="text-sm text-gray-600">Crear respaldos automáticos de tus datos</p>
              </div>
              <Button
                variant={settings.autoBackup ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('autoBackup', !settings.autoBackup)}
              >
                {settings.autoBackup ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Frecuencia de Respaldo</Label>
              <select
                id="backupFrequency"
                value={settings.backupFrequency}
                onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!settings.autoBackup}
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataRetention">Retención de Datos (años)</Label>
              <select
                id="dataRetention"
                value={settings.dataRetention}
                onChange={(e) => handleInputChange('dataRetention', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 año</option>
                <option value="3">3 años</option>
                <option value="5">5 años</option>
                <option value="10">10 años</option>
                <option value="0">Indefinido</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Acceso API</Label>
                <p className="text-sm text-gray-600">Permitir acceso a través de API</p>
              </div>
              <Button
                variant={settings.apiAccess ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('apiAccess', !settings.apiAccess)}
              >
                {settings.apiAccess ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
          <CardDescription>
            Detalles sobre tu cuenta y uso del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Versión del Sistema</Label>
              <p className="text-sm text-gray-600">v1.0.0</p>
            </div>
            <div className="space-y-2">
              <Label>Última Actualización</Label>
              <p className="text-sm text-gray-600">-</p>
            </div>
            <div className="space-y-2">
              <Label>Espacio Utilizado</Label>
              <p className="text-sm text-gray-600">-</p>
            </div>
            <div className="space-y-2">
              <Label>Estado de la Cuenta</Label>
              <Badge variant="secondary">Activa</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return renderPerfilTab();
      case 'notificaciones':
        return renderNotificacionesTab();
      case 'seguridad':
        return renderSeguridadTab();
      case 'apariencia':
        return renderAparienciaTab();
      case 'sistema':
        return renderSistemaTab();
      default:
        return renderPerfilTab();
    }
  };

  return (
    <NavigationWrapper>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-600 mt-2">Gestiona tu cuenta y preferencias del sistema</p>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64">
                  <Card>
                    <CardContent className="p-0">
                      <nav className="space-y-1">
                        {tabs.map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-none transition-colors ${
                                activeTab === tab.id
                                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="mr-3 h-4 w-4" />
                              {tab.label}
                            </button>
                          );
                        })}
                      </nav>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Main Content */}
                <div className="flex-1">
                  {renderTabContent()}
                  
                  {/* Save Button */}
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}
