import React, { useState } from 'react';
import { registerAdmin } from '../../services/userApiService';
import Alert from './Alert';

const AdminManager: React.FC = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Estado de carga y alertas
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    isVisible: boolean;
  }>({ type: 'info', title: '', message: '', isVisible: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertInfo({ ...alertInfo, isVisible: false });

    // Validación simple de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setAlertInfo({
        type: 'warning',
        title: 'Error de validación',
        message: 'Las contraseñas no coinciden.',
        isVisible: true,
      });
      return;
    }

    if (formData.password.length < 6) {
        setAlertInfo({
          type: 'warning',
          title: 'Contraseña débil',
          message: 'La contraseña debe tener al menos 6 caracteres.',
          isVisible: true,
        });
        return;
    }

    setLoading(true);

    try {
      await registerAdmin(formData.user, formData.email, formData.password);
      
      setAlertInfo({
        type: 'success',
        title: 'Éxito',
        message: 'Nuevo administrador registrado correctamente.',
        isVisible: true,
      });
      
      // Limpiar formulario
      setFormData({ user: '', email: '', password: '', confirmPassword: '' });

    } catch (err: any) {
      setAlertInfo({
        type: 'error',
        title: 'Error',
        message: err.message || 'No se pudo registrar al administrador.',
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Agregar Administrador</h1>
      </div>

      <div className="mb-4">
        <Alert
          type={alertInfo.type}
          title={alertInfo.title}
          message={alertInfo.message}
          isVisible={alertInfo.isVisible}
          onClose={() => setAlertInfo({ ...alertInfo, isVisible: false })}
        />
      </div>

      {/* Formulario de Registro */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Ingrese los datos del nuevo administrador:</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre de Usuario */}
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ej: Admin"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Institucional</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="admin@duocuc.cl"
            />
          </div>

          {/* Contraseña y Confirmación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Botón Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Registrando...' : 'Crear Administrador'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminManager;