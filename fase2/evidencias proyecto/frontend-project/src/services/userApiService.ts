import apiService, { setAuthToken } from "./apiService";

// Login
export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await apiService.post("/admin/login", { email, password });

    // Si el login es exitoso, guarda el token
    if (response.data.accessToken) {
      const { accessToken } = response.data;
      localStorage.setItem("admin_token", accessToken);
      setAuthToken(accessToken); // Llama a la función central para setear el token
    }

    return response.data;
  } catch (error: any) {
    console.error("Error en el login:", error.response.data);
    throw error.response.data;
  }
};

// Registro
export const registerAdmin = async (
  user: string,
  email: string,
  password: string
) => {
  try {
    const response = await apiService.post("/admin/register", {
      user,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en el registro:", error.response.data);
    throw error.response.data;
  }
};
