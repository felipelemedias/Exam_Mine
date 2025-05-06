import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import logoIcon from "../../assets/exam-mine-logo.png";

export const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Buscar remédio", to: "/agent/medication-prices" },
    { label: "Consultar bula", to: "/agent/medication-info" },
    { label: "Avaliação de dúvidas com IA", to: "/agent/general-question" },
    ...(authState.isAuthenticated
      ? [
          { label: "Análise de Exames", to: "/agent/exam-analyzer" },
          { label: "Histórico", to: "/history" },
        ]
      : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl md:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src={logoIcon} alt="Exam Mine" className="w-auto h-8 md:h-10" />

        </Link>

        {/* NAV + AUTH (desktop) */}
        <div className="items-center hidden space-x-8 md:flex">
          <nav className="flex items-center space-x-4">
            {links.map((link, i) => (
              <React.Fragment key={link.to}>
                {i > 0 && (
                  <Separator
                    orientation="vertical"
                    className="h-6 mx-2 bg-gray-300"
                  />
                )}
                <Link
                  to={link.to}
                  className="text-gray-700 hover:text-blue-600 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {authState.isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {authState.user?.photoURL && (
                <img
                  src={authState.user.photoURL}
                  alt="Avatar"
                  className="object-cover w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {authState.user?.displayName || authState.user?.email}
              </span>
              <Button
                variant="outline"
                className="text-sm text-[#1760c6]"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-[#1760c6] hover:underline whitespace-nowrap"
            >
              Entrar
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-gray-700 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="bg-white border-t border-gray-200 shadow-sm md:hidden">
          <div className="flex flex-col px-4 py-2 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {authState.isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={handleLogout}
              >
                Sair
              </Button>
            ) : (
              <Link
                to="/login"
                className="py-2 text-center font-semibold text-[#1760c6] hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
