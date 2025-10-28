import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../componentes/componentes_admin/Navbar';
import Sidebar from '../../componentes/componentes_admin/Sidebar';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main> 
      </div>
    </div>
  );
};

export default AdminLayout;