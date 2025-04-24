import React from 'react';
import { AppHeader } from '../../components/Header/AppHeader';
import { InteractionHistory } from '../../components/History/InteractionHistory';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

export const HistoryScreen: React.FC = () => {
  const { authState } = useAuth();
  
  // Show loading while checking auth state
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
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="flex-1 pt-20 pb-6">
        <InteractionHistory />
      </main>
    </div>
  );
};