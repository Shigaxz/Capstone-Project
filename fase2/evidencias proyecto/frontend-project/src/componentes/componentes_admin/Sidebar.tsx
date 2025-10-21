import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const linkClasses = "block px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150";
  const activeLinkClasses = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? `${linkClasses} bg-blue-100 text-blue-700` 
      : `${linkClasses} text-gray-600 hover:bg-gray-200 hover:text-gray-900`;

  return (
    // Contenedor del Sidebar
    <aside className="w-64 bg-white shadow-md flex-shrink-0 overflow-y-auto"> {/* Ancho fijo */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Menú</h2>
        <nav className="space-y-1">
          <NavLink to="/admin/dashboard/locations" className={activeLinkClasses}>
            Gestionar Lugares
          </NavLink>

          <NavLink to="/admin/dashboard/spaces" className={activeLinkClasses}>
            Gestionar Espacios
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;