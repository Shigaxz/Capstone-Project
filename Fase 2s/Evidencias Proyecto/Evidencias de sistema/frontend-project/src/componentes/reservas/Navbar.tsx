import React from 'react';
import { Link } from 'react-router-dom';

// 1. Definimos las props que recibirá el componente
interface HeaderPublicProps {
  buttonText: string;
  buttonPath: string;
}

const HeaderPublic: React.FC<HeaderPublicProps> = ({ buttonText, buttonPath }) => {
  return (
    <nav className="bg-[#012C56] shadow-md w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        <div className="flex items-center">
          <Link to="/" className="flex items-center no-underline">
          <img 
            src="/images/logo.png" 
            alt="Logo CITT"
            className="h-10 w-auto mr-4 md:block hidden"
          />
          <span className="text-xl font-bold text-white">
            Sistema de Reservas y memorias
          </span>
        </Link>
        </div>

        <div className='md:w-auto w-full'>
          <Link 
            to={buttonPath} 
            className="
              bg-white text-[#012C56] font-semibold 
              py-2 px-4 rounded 
              hover:bg-gray-200 transition-colors duration-200
            "
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HeaderPublic;