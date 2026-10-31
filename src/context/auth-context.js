import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

// Encapsula el estado de autenticación (token / isLogged) que antes vivía
// como useState local dentro de AppContent en App.js, incluyendo la
// verificación de sesión guardada en localStorage al cargar la app.
export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Verificar autenticación al cargar (idéntico al comportamiento original)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsLogged(true);
    }
  }, []);

  // Login: usado como onLogin en el componente Login (recibe el token o 'guest')
  const login = (newToken) => {
    setToken(newToken);
    setIsLogged(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLogged(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, isLogged, setToken, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Validación de las props que recibe AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
