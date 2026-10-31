// Utilidad para logging en desarrollo y producción
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

// Función para eliminar console.log automáticamente en build
export const removeConsoleLogs = () => {
  if (!isDevelopment) {
    // En producción, reemplazar console.log con función vacía
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    // Mantener console.error para errores críticos
  }
};

export default logger;
