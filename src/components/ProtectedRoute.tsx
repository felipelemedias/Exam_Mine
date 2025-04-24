import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useAuth();

  // Show loading spinner while auth state is being checked
  if (authState.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color="#1760C6" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render children if authenticated
  return <>{children}</>;
};