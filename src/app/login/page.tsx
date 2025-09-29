'use client';

import { useRouter } from 'next/navigation';
import { Login } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = (formData: { email: string; password: string }) => {
    console.log('Login data:', formData);
    
    // Mock user data based on credentials
    const mockUser = {
      id: '1',
      name: 'Juan Pérez',
      email: formData.email,
      role: 'Abogado' as const
    };
    
    // Call the login function from auth context
    login(mockUser);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Aquí irá la lógica para recuperar contraseña
  };

  return (
    <Login 
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
    />
  );
}
