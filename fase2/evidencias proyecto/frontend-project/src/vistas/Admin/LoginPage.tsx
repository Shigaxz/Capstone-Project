import React, { useState } from "react";
import { loginAdmin, registerAdmin } from "../../services/userApiService";
import Navbar from "../../componentes/componentes_admin/Navbar";

const LoginPage = () => {
  // Estado para saber qué formulario mostrar
  const [isLoginView, setIsLoginView] = useState(true);
  // Estado unificado para todos los campos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // Estados para manejar carga, errores y éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Manejador actualizar el estado del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // Función para alternar la vista
  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    // Limpia los estados al cambiar de vista
    setError(null);
    setSuccess(null);
    setFormData({ name: "", email: "", password: "" });
  };

  // Manejador para enviar el formulario (Login o Registro)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLoginView) {
        await loginAdmin(formData.email, formData.password);
        window.location.href = "/admin/dashboard";
      } else {
        await registerAdmin(formData.name, formData.email, formData.password);
        setSuccess(
          "¡Administrador registrado con éxito! Ahora puedes iniciar sesión."
        );
        handleToggleView();
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="
        min-h-screen w-full bg-cover bg-center 
        flex flex-col
      "
      style={{ backgroundImage: 'url("/images/bg_admin.webp")' }}
    >
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4">
        <div 
          className="
            w-full max-w-sm p-8 rounded-lg shadow-lg
            bg-white
            bg-opacity-80
            backdrop-filter
            backdrop-blur-md
          "
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            {isLoginView ? "Admin Login" : "Admin Registro"}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
              {success}
            </div>
          )}

          {/* --- Formulario --- */}
          <form onSubmit={handleSubmit}>
            {!isLoginView && (
              <div className="mb-4">
                <label
                  className="block text-gray-800 mb-2 font-semibold"
                  htmlFor="name"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-800 mb-2 font-semibold"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-800 mb-2 font-semibold"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading
                ? "Procesando..."
                : isLoginView
                ? "Ingresar"
                : "Registrar"}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={handleToggleView}
              className="text-sm text-blue-700 font-semibold hover:underline"
            >
              {isLoginView
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
