import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../componentes/componentes_admin/Navbar';
import Sidebar from '../../componentes/componentes_admin/Sidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;