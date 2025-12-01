import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <nav className="bg-[#012C56] shadow-lg w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center">
          {/* Botón de Hamburguesa para móvil */}
          <button 
            onClick={onToggleSidebar} 
            className="text-white p-2 mr-2 rounded-md md:hidden hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center">
            <Link to="/" className="flex items-center no-underline">
          <img 
            src="/images/logo.png" 
            alt="Logo CITT"
            className="h-10 w-auto mr-4"
          />
          <span className="text-xl font-bold text-white">
            Sistema de Reservas y memorias
          </span>
        </Link>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;