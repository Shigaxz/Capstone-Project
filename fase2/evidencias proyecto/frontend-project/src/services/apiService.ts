import axios from 'axios';

// Lee la URL base de tu API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;

// Crea la instancia de Axios que usará toda la app
const apiService = axios.create({
  baseURL: API_URL,
});

// Establece la API Key como header por defecto para TODAS las peticiones
if (API_KEY) {
  apiService.defaults.headers.common['x-api-key'] = API_KEY;
} else {
  console.warn('VITE_API_KEY no encontrada en .env'); // Advertencia si falta
}

// Función para setear el token JWT en la instancia
export const setAuthToken = (token: string | null) => {
  if (token) {
    // Si hay token, lo añade a todas las peticiones futuras
    apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Si no hay token, lo borra
    delete apiService.defaults.headers.common['Authorization'];
  }
};

// Función de Logout (que actúa sobre la instancia central)
export const logout = () => {
  localStorage.removeItem('admin_token');
  setAuthToken(null); // Borra el token de la instancia de Axios
};

// Comprueba si ya hay un token en localStorage
const token = localStorage.getItem('admin_token');
if (token) {
  setAuthToken(token);
}

apiService.interceptors.response.use(
  // Función: Si la respuesta es exitosa, no hagas nada.
  (response) => {
    return response;
  },
  // Función: Si la respuesta es un error
  (error) => {
    // Verificamos si el error es un 401
    if (error.response && error.response.status === 401) {
      // Si es 401, llamamos a la función de logout.
      logout();
    }
    // Rechazamos la promesa para que el componente que hizo la llamada
    return Promise.reject(error);
  }
);

// Exporta la instancia configurada
export default apiService;