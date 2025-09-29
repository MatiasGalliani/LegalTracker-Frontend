import { Sidebar } from '@/components';
import { LoadingSpinner } from './ui/loading-spinner';

interface MainLoadingProps {
  message?: string;
}

export default function MainLoading({ message = "Cargando..." }: MainLoadingProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-lg text-gray-600">{message}</p>
                <p className="text-sm text-gray-400 mt-2">Por favor espera...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

