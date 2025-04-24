import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { ClipLoader } from 'react-spinners';

export const LoginScreen: React.FC = () => {
  const { authState, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/agent/exam-analyzer');
    }
  }, [authState.isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Navigation will happen automatically via the useEffect above
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

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
      <main className="flex items-center justify-center flex-1 pt-20 pb-6">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            <p className="mt-2 text-sm text-gray-600">
              Entre com sua conta Google para acessar todos os recursos
            </p>
          </div>

          {authState.error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {authState.error}
            </div>
          )}

          <div className="flex flex-col items-center">
            <Button
              onClick={handleGoogleLogin}
              disabled={authState.loading}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {authState.loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Entrar com Google
                </>
              )}
            </Button>

            <div className="mt-6 text-sm text-center">
              <p className="text-gray-600">
                Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};