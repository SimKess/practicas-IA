import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '../config/constants';

/**
 * Instancia de Axios configurada para comunicarse con el API del backend
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de request: Añade el token JWT a cada petición
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response: Maneja errores de autenticación y refresa tokens expirados
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Intenta refrescar el token
        const response = await apiClient.post('/refresh', {
          refresh_token: refreshToken,
        });

        // Guarda los nuevos tokens
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
        localStorage.setItem(
          STORAGE_KEYS.TOKEN_EXPIRY,
          new Date().getTime() + response.data.expires_in * 1000
        );

        // Reinicia la solicitud original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si el refresco falla, limpia los datos de autenticación
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
        localStorage.removeItem(STORAGE_KEYS.USERNAME);

        // Dispara un evento personalizado para que el contexto de autenticación lo detecte
        window.dispatchEvent(new Event('auth-error'));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Servicio de autenticación
 */
export const authAPI = {
  /**
   * Realiza login con usuario y contraseña
   */
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/login', {
        username,
        password,
      });

      // Guarda los datos del token
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
      localStorage.setItem(
        STORAGE_KEYS.TOKEN_EXPIRY,
        new Date().getTime() + response.data.expires_in * 1000
      );
      localStorage.setItem(STORAGE_KEYS.USERNAME, username);

      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Error al iniciar sesión';
      throw new Error(message);
    }
  },

  /**
   * Realiza logout limpiando los datos de autenticación
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
  },

  /**
   * Refresa el token de acceso
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/refresh', {
        refresh_token: refreshToken,
      });

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access_token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh_token);
      localStorage.setItem(
        STORAGE_KEYS.TOKEN_EXPIRY,
        new Date().getTime() + response.data.expires_in * 1000
      );

      return response.data;
    } catch (error) {
      // Si falla el refresco, limpia los datos
      authAPI.logout();
      throw error;
    }
  },

  /**
   * Obtiene el token almacenado
   */
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Verifica si el token ha expirado
   */
  isTokenExpired: () => {
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry);
  },

  /**
   * Obtiene el tiempo restante del token en segundos
   */
  getTokenTimeRemaining: () => {
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!expiry) return 0;
    const remaining = Math.max(0, Math.floor((parseInt(expiry) - new Date().getTime()) / 1000));
    return remaining;
  },
};

export default apiClient;
