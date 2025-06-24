import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
      
      if (user) {
        // In a real app, you would check for admin role with claims or database
        // For now, every authenticated user is considered an admin
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#006297] mx-auto" />
          <p className="mt-4 text-gray-600">Verifying your credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to unauthorized page if not admin
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and meets role requirements
  return <>{children}</>;
}
