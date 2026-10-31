import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configuración global de toast
const ToastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

// Funciones helper para mostrar toasts
export const showToast = {
    success: (message) => toast.success(message, ToastConfig),
    error: (message) => toast.error(message, ToastConfig),
    warning: (message) => toast.warning(message, ToastConfig),
    info: (message) => toast.info(message, ToastConfig),
};

// Componente Toast Container
export const ToastProvider = () => (
    <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    // Nota: se deja inline a propósito. Es configuración del propio ToastContainer
    // de react-toastify (no hay CSS externo equivalente verificado que no arriesgue
    // romper el tamaño de fuente de las notificaciones).
    style={{ fontSize: '14px' }}
    />
);

export default showToast;
