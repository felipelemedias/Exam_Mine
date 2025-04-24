import React from 'react';
import { RegisterForm } from '../../components/Auth/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

export const RegisterScreen: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/agent/exam-analyzer');
    }
  }, [authState.isAuthenticated, navigate]);

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-white shadow-[0px_2px_10px_#00507d14]">
        <div className="flex items-center justify-between h-full px-8">
          <div className="flex items-center h-[45px] cursor-pointer" onClick={handleBackClick}>
            <div className="w-[39px] h-[45px] bg-[url(/group-34.png)] bg-[100%_100%]" />
            <div className="ml-6 text-[14.6px] whitespace-nowrap font-['Archivo',Helvetica]">
              <span className="text-[#565656]">Exam </span>
              <span className="font-bold text-[#565656]">Mine</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div 
              className="ml-8 font-semibold text-sm text-[#1760c6] cursor-pointer hover:underline"
              onClick={handleBackClick}
            >
              Voltar
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-6 flex items-center justify-center">
        <RegisterForm />
      </main>
    </div>
  );
};