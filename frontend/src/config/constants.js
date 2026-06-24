// Configuración de constantes de la aplicación

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10);
export const TOKEN_REFRESH_THRESHOLD = parseInt(process.env.REACT_APP_TOKEN_REFRESH_THRESHOLD || '30', 10);

// Claves de almacenamiento local
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  USERNAME: 'username',
};

// Endpoints de API
export const API_ENDPOINTS = {
  LOGIN: '/login',
  REFRESH: '/refresh',
};

export const CONFIG = {
  // Timing del token (en segundos)
  TOKEN_EXPIRY_TIME: 300, // 5 minutos
  TOKEN_REFRESH_BEFORE: 20, // Refrescar 20 segundos antes

  // Mensajes de error
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Usuario o contraseña inválidos',
    NETWORK_ERROR: 'Error de conexión. Por favor, intenta de nuevo.',
    SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
    TOKEN_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
  },

  // Storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    TOKEN_EXPIRES_AT: 'token_expires_at',
    USERNAME: 'username',
  },
};

export const MICROSOFT_CERTIFICATIONS_2026 = [
  {
    title: 'Azure AI Apps and Agents Developer Associate',
    detail: 'Reemplaza Azure AI Engineer Associate en especializaciones de IA (junio 2026).',
    source: 'Anuncios Microsoft Partner Center, junio 2026',
  },
  {
    title: 'Machine Learning Operations Engineer Associate',
    detail: 'Nueva opción de skilling para AI Platform en Azure tras retiro de Azure Data Scientist Associate.',
    source: 'Anuncios Microsoft Partner Center, junio 2026',
  },
  {
    title: 'Cloud and AI Security Engineer Associate',
    detail: 'Reemplaza Azure Security Engineer Associate para cambios previstos en julio 2026.',
    source: 'Anuncios Microsoft Partner Center, junio 2026',
  },
  {
    title: 'Agentic AI Business Solutions Architect',
    detail: 'Nueva certificación para escenarios de Dynamics 365 y Power Platform en 2026.',
    source: 'Anuncios Microsoft Partner Center, junio 2026',
  },
];

export default CONFIG;
