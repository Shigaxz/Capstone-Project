import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const linkClasses = "block px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150";
  const activeLinkClasses = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? `${linkClasses} bg-blue-100 text-blue-700` 
      : `${linkClasses} text-gray-600 hover:bg-gray-200 hover:text-gray-900`;

  return (
    <>
      <aside className={`
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        fixed md:relative inset-y-0 left-0 z-30 w-64 bg-white shadow-md 
        flex-shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out
      `}>
        {/* Overlay para móvil - Ahora dentro del aside para que se mueva con él */}
        <div 
          className={`fixed inset-0 bg-white shadow bg-opacity-50 z-20 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={onClose}
          aria-hidden="true"
        ></div>
        {/* Contenido del Sidebar */}
        <div className="relative z-30 h-full flex flex-col">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Menú</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 p-1 rounded-full md:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400"
                        aria-label="Cerrar menú"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <nav className="space-y-1">
                    <NavLink to="/admin/dashboard/locations" className={activeLinkClasses} onClick={onClose}>
                    Gestionar Lugares
                    </NavLink>
        
                    <NavLink to="/admin/dashboard/spaces" className={activeLinkClasses} onClick={onClose}>
                    Gestionar Espacios
                    </NavLink>
        
                    <NavLink to="/admin/dashboard/memories" className={activeLinkClasses} onClick={onClose}>
                    Gestionar Memorias
                    </NavLink>
        
                    <NavLink to="/admin/dashboard/reservations" className={activeLinkClasses} onClick={onClose}>
                    Gestionar Reservas
                    </NavLink>
                </nav>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;