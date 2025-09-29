'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2, 
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge
} from '@/components';

interface Cliente {
  id: string;
  tipo: 'persona' | 'empresa';
  nombre: string;
  documento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaRegistro: string;
  expedientes: number;
}

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    tipo: 'persona' as 'persona' | 'empresa',
    nombre: '',
    documento: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  // Empty initial state - data will come from API
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.documento.includes(searchTerm) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCliente) {
      // Update existing client
      setClientes(clientes.map(cliente => 
        cliente.id === editingCliente.id 
          ? { ...cliente, ...formData }
          : cliente
      ));
    } else {
      // Add new client
      const newCliente: Cliente = {
        id: Date.now().toString(),
        ...formData,
        fechaRegistro: new Date().toISOString().split('T')[0],
        expedientes: 0
      };
      setClientes([...clientes, newCliente]);
    }
    
    // Reset form
    setFormData({
      tipo: 'persona',
      nombre: '',
      documento: '',
      email: '',
      telefono: '',
      direccion: ''
    });
    setEditingCliente(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      tipo: cliente.tipo,
      nombre: cliente.nombre,
      documento: cliente.documento,
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClientes(clientes.filter(cliente => cliente.id !== id));
    }
  };

  const openNewDialog = () => {
    setEditingCliente(null);
    setFormData({
      tipo: 'persona',
      nombre: '',
      documento: '',
      email: '',
      telefono: '',
      direccion: ''
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                <p className="text-gray-600 mt-2">Gestión de clientes y empresas</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNewDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="max-h-[90vh] overflow-y-auto"
                  style={{
                    width: '90vw',
                    maxWidth: 'none'
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>
                      {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCliente 
                        ? 'Modifica la información del cliente.' 
                        : 'Agrega un nuevo cliente al sistema.'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tipo">Tipo</Label>
                          <select
                            id="tipo"
                            value={formData.tipo}
                            onChange={(e) => setFormData({...formData, tipo: e.target.value as 'persona' | 'empresa'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="persona">Persona</option>
                            <option value="empresa">Empresa</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="documento">
                            {formData.tipo === 'persona' ? 'DNI' : 'CUIT'}
                          </Label>
                          <Input
                            id="documento"
                            value={formData.documento}
                            onChange={(e) => setFormData({...formData, documento: e.target.value})}
                            placeholder={formData.tipo === 'persona' ? 'DNI' : 'CUIT'}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nombre">
                          {formData.tipo === 'persona' ? 'Nombre Completo' : 'Razón Social'}
                        </Label>
                        <Input
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          placeholder={formData.tipo === 'persona' ? 'Nombre completo' : 'Razón social'}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="email@cliente.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                            placeholder="Teléfono"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          value={formData.direccion}
                          onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                          placeholder="Dirección"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingCliente ? 'Actualizar' : 'Crear Cliente'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, documento o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 desde el mes pasado
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Personas</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clientes.filter(c => c.tipo === 'persona').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clientes individuales
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Empresas</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clientes.filter(c => c.tipo === 'empresa').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clientes corporativos
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expedientes Activos</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clientes.reduce((sum, c) => sum + c.expedientes, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total de casos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Clients Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Clientes</CardTitle>
                <CardDescription>
                  {filteredClientes.length} de {clientes.length} clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Expedientes</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientes.length === 0 ? (
                      <TableRow className="hover:!bg-transparent">
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <FileText className="h-12 w-12 text-gray-400" />
                            <div className="text-center">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No se encontraron clientes
                              </h3>
                              <p className="text-gray-500 mb-4">
                                Intentá ajustar los filtros de búsqueda
                              </p>
                              <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Cliente
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClientes.map((cliente) => (
                        <TableRow key={cliente.id} className="hover:!bg-transparent">
                          <TableCell>
                            <Badge variant={cliente.tipo === 'persona' ? 'default' : 'secondary'}>
                              {cliente.tipo === 'persona' ? (
                                <>
                                  <User className="mr-1 h-3 w-3" />
                                  Persona
                                </>
                              ) : (
                                <>
                                  <Building2 className="mr-1 h-3 w-3" />
                                  Empresa
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{cliente.nombre}</TableCell>
                          <TableCell>{cliente.documento}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {cliente.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="mr-1 h-3 w-3" />
                                  {cliente.email}
                                </div>
                              )}
                              {cliente.telefono && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {cliente.telefono}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {cliente.expedientes} casos
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(cliente.fechaRegistro).toLocaleDateString('es-AR')}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(cliente)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(cliente.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
