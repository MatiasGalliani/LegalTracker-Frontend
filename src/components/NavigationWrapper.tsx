'use client';

import { useNavigation } from '@/contexts/NavigationContext';
import MainLoading from './MainLoading';
import { useEffect } from 'react';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  const { isLoading, setLoading } = useNavigation();

  // Debug logging
  useEffect(() => {
    console.log('NavigationWrapper - isLoading:', isLoading);
  }, [isLoading]);

  // Stop loading when component mounts (page loads)
  useEffect(() => {
    // Add a delay to ensure the loading state is visible
    const timer = setTimeout(() => {
      console.log('NavigationWrapper - stopping loading');
      setLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [setLoading]);

  if (isLoading) {
    console.log('NavigationWrapper - showing MainLoading');
    return <MainLoading />;
  }

  return <>{children}</>;
}
