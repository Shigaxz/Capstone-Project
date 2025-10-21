import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#012C56] shadow-lg w-full">
      <div className="container mx-auto px-4 py-3 flex items-center">
        
        <img 
          src="/images/logo.png" 
          alt="Logo CITT"
          className="h-10 w-auto mr-4"
        />

        {/* Título */}
        <span className="text-xl font-bold text-white">
          Sistema de Reservas y memorias
        </span>

      </div>
    </nav>
  );
};

export default Navbar;