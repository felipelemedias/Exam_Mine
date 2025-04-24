import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '../ui/separator';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

export const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-white shadow-[0px_2px_10px_#00507d14]">
      <div className="flex items-center justify-between h-full px-8">
        <div 
          className="flex items-center h-[45px] cursor-pointer" 
          onClick={() => handleNavigation('/')}
        >
          <div className="w-[39px] h-[45px] bg-[url(/group-34.png)] bg-[100%_100%]" />
          <div className="ml-6 text-[14.6px] whitespace-nowrap font-['Archivo',Helvetica]">
            <span className="text-[#565656]">Exam </span>
            <span className="font-bold text-[#565656]">Mine</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-[10px]">
            <div 
              className="font-['Open_Sans',Helvetica] text-[#565656] text-[16.9px] cursor-pointer hover:text-blue-600"
              onClick={() => handleNavigation(`/agent/medication-prices`)}
            >
              Buscar remédio
            </div>
            <Separator
              orientation="vertical"
              className="h-[30px] bg-[#e6e6e6]"
            />
            <div 
              className="font-['Open_Sans',Helvetica] text-[#565656] text-[16.9px] cursor-pointer hover:text-blue-600"
              onClick={() => handleNavigation(`/agent/medication-info`)}
            >
              Consultar bula
            </div>
            <Separator
              orientation="vertical"
              className="h-[30px] bg-[#e6e6e6]"
            />
            <div 
              className="font-['Open_Sans',Helvetica] text-[#565656] text-[16.9px] cursor-pointer hover:text-blue-600"
              onClick={() => handleNavigation(`/agent/general-question`)}
            >
              Avaliação de dúvidas com IA
            </div>
            
            {/* Show Análise de Exames only for authenticated users */}
            {authState.isAuthenticated && (
              <>
                <Separator
                  orientation="vertical"
                  className="h-[30px] bg-[#e6e6e6]"
                />
                <div 
                  className="font-['Open_Sans',Helvetica] text-[#565656] text-[16.9px] cursor-pointer hover:text-blue-600"
                  onClick={() => handleNavigation('/agent/exam-analyzer')}
                >
                  Análise de Exames
                </div>
                <Separator
                  orientation="vertical"
                  className="h-[30px] bg-[#e6e6e6]"
                />
                <div 
                  className="font-['Open_Sans',Helvetica] text-[#565656] text-[16.9px] cursor-pointer hover:text-blue-600"
                  onClick={() => handleNavigation('/history')}
                >
                  Histórico
                </div>
              </>
            )}
          </div>
          
          {/* Auth buttons */}
          {authState.isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                {authState.user?.photoURL && (
                  <img 
                    src={authState.user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">
                  {authState.user?.displayName || authState.user?.email}
                </span>
              </div>
              <Button 
                variant="outline"
                className="ml-4 font-semibold text-sm text-[#1760c6]"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          ) : (
            <div 
              className="ml-8 font-semibold text-sm text-[#1760c6] cursor-pointer hover:underline"
              onClick={() => handleNavigation('/login')}
            >
              Entrar
            </div>
          )}
        </div>
      </div>
    </header>
  );
};