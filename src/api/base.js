import { logger } from 'utils/logger';

// Resolver de baseURL para el backend sin hardcodear puertos
export function getApiBaseUrl() {
  // 1) Prioriza la variable de entorno de CRA (.env.production / .env.local).
  // No se usa import.meta.env (propio de Vite): este proyecto es CRA y Jest no lo entiende.
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) return String(envUrl).replace(/\/$/, '');

  // 2) Si el frontend está servido por el mismo host, usa mismo origen
  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname, port } = window.location;
    // Si estamos en 3000 (CRA), intenta 5000; si no, usa mismo origen
    if (port === '3000') return `${protocol}//${hostname}:5000`;
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }

  // 3) Fallback local
  return 'http://localhost:5000';
}

export async function apiFetch(path, options = {}, token = null) {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  
  // Headers por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Agregar token de autenticación si existe (pasado como parámetro)
  if (token) {
    defaultHeaders['x-auth-token'] = token;
  }

  // Combinar headers
  const finalOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  logger.log('🌐 API Request:', {
    url,
    method: finalOptions.method || 'GET',
    hasToken: !!token,
    headers: finalOptions.headers
  });

  try {
    const response = await fetch(url, finalOptions);

    logger.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    // Los llamadores (Login.js, crearrutina.js) comprueban response.ok y leen
    // el .json() ellos mismos, así que aquí NO se lanza error por códigos 4xx/5xx:
    // solo así pueden mostrar el mensaje real del servidor (ej. "Credenciales inválidas")
    // en vez de caer siempre en el catch genérico de fallo de red.
    return response;
  } catch (error) {
    throw error;
  }
}