// src/components/Header/MobileHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

interface MobileHeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  links: { label: string; to: string }[];
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  menuOpen,
  setMenuOpen,
  links,
  isAuthenticated,
  onLogout,
}) => {
  return (
    <>
      {/* botão hamburguer */}
      <button
        className="text-2xl text-gray-700 md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      {/* painel de menu */}
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

            {isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
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
    </>
  );
};
