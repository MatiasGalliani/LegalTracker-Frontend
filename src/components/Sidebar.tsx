'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  DollarSign, 
  Settings, 
  Bell, 
  Search,
  BarChart3,
  HelpCircle,
  LogOut,
  Clock,
  Receipt,
  X,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { setLoading, setLoadingMessage } = useNavigation();
  const { user, logout } = useAuth();

  // Mock notification data
  const [notifications] = useState<Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>>([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationItemClick = (notificationId: number) => {
    // Here you would typically mark the notification as read
    console.log('Notification clicked:', notificationId);
  };

  const markAllAsRead = () => {
    // Here you would typically mark all notifications as read
    console.log('Mark all as read');
  };

  const handleLogout = () => {
    // Use the logout function from AuthContext
    logout();
    
    // Close dialog
    setIsLogoutDialogOpen(false);
    
    // Redirect to login page
    router.push('/login');
  };

  const openLogoutDialog = () => {
    setIsLogoutDialogOpen(true);
  };
  
  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', badge: undefined },
    { icon: Users, label: 'Clientes', href: '/clientes', badge: undefined },
    { icon: FileText, label: 'Expedientes', href: '/expedientes', badge: undefined },
    { icon: Clock, label: 'Plazos', href: '/plazos', badge: undefined },
    { icon: Calendar, label: 'Audiencias', href: '/audiencias', badge: undefined },
    // { icon: DollarSign, label: 'Honorarios', href: '/honorarios' },
    // { icon: Receipt, label: 'Facturación', href: '/facturacion' },
    { icon: BarChart3, label: 'Reportes', href: '/reportes', badge: undefined },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  const handleNavigation = (href: string) => {
    // Don't show loading if already on the same page
    if (pathname === href) return;
    
    console.log('Sidebar - starting navigation to:', href);
    setLoadingMessage(`Cargando ${getPageName(href)}...`);
    setLoading(true);
    console.log('Sidebar - loading state set to true');
    
    // Navigate immediately - the loading will be stopped when the new page loads
    console.log('Sidebar - navigating to:', href);
    router.push(href);
  };

  const getPageName = (href: string) => {
    const pageNames: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/clientes': 'Clientes',
      '/expedientes': 'Expedientes',
      '/plazos': 'Plazos',
      '/audiencias': 'Audiencias',
      // '/honorarios': 'Honorarios',
      // '/facturacion': 'Facturación',
      '/reportes': 'Reportes',
      '/configuracion': 'Configuración',
      '/ayuda': 'Ayuda'
    };
    return pageNames[href] || 'Página';
  };

  const isActive = (href: string) => {
    if (!isMounted) return false;
    return pathname === href;
  };

  const secondaryItems = [
    { icon: Settings, label: 'Configuración', href: '/configuracion' },
    { icon: HelpCircle, label: 'Ayuda', href: '/ayuda' },
  ];

  return (
    <div className={`flex h-screen w-64 flex-col bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <div className="w-48 h-auto">
          <Image 
            src="/logo.svg" 
            alt="LegalTracker" 
            width={192}
            height={48}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start h-10 px-3 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                  active 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className={`mr-3 h-4 w-4 transition-colors duration-200 ${
                  active ? 'text-white' : 'text-gray-500'
                }`} />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 text-xs transition-all duration-200 ${
                      active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start h-10 px-3 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                  active 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className={`mr-3 h-4 w-4 transition-colors duration-200 ${
                  active ? 'text-white' : 'text-gray-500'
                }`} />
                <span className="flex-1 text-left font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Notifications */}
      <div className="px-4 py-2 relative" ref={notificationRef}>
        <Button 
          variant="outline" 
          className="w-full justify-start h-10 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
          onClick={handleNotificationClick}
        >
          <Bell className="mr-3 h-4 w-4" />
          <span className="flex-1 text-left">Notificaciones</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notification Dropdown */}
        {isNotificationOpen && (
          <div className="fixed top-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[calc(100vh-2rem)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Marcar todas como leídas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsNotificationOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No hay notificaciones</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationItemClick(notification.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 mt-1 ${notification.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`text-sm font-semibold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    setIsNotificationOpen(false);
                    // Navigate to full notifications page if you have one
                    console.log('View all notifications');
                  }}
                >
                  Ver todas las notificaciones
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Usuario" />
            <AvatarFallback>
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role || 'Abogado'}
            </p>
          </div>
          <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 text-gray-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <LogOut className="h-5 w-5 text-red-600" />
                  Cerrar Sesión
                </DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que quieres cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsLogoutDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
