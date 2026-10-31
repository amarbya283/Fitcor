import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { apiFetch } from 'api/base';
import 'components/css/login.css';

// Pantalla de login/registro. onLogin es el callback del AuthContext: se le pasa el
// token recibido del backend (o el string 'guest' para el acceso como invitado) y es
// quien decide cómo continuar el flujo de autenticación de la app.
function Login({ onLogin }) {
  // Estados agrupados para mejor organización
  // Datos y estado del formulario de inicio de sesión
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    showPassword: false,
    remember: false
  });

  // Datos y estado del formulario de registro (solo visible si uiState.showRegister es true)
  const [registerState, setRegisterState] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    showPassword: false
  });

  // Controla qué formulario se muestra: login o registro
  const [uiState, setUiState] = useState({
    showRegister: false
  });

  // Refs para los formularios
  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);

  // Función para guardar token de forma segura
  // Persiste el token de sesión en localStorage; si falla (p.ej. modo privado
  // del navegador) se ignora silenciosamente para no romper el login.
  const saveToken = (token) => {
    try {
      localStorage.setItem('token', token);
    } catch (error) {
      // Error al guardar en localStorage
    }
  };

  // Envía las credenciales de login al backend y, si son válidas, guarda el
  // token y notifica al padre (onLogin) para completar el inicio de sesión.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginState(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginState.email, password: loginState.password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        saveToken(data.token);
        onLogin(data.token);  // ← Pasa el token aquí
      } else {
        setLoginState(prev => ({ ...prev, error: data.msg || 'Error de autenticación' }));
      }
    } catch (err) {
      setLoginState(prev => ({ ...prev, error: 'Error de red' }));
    }
    setLoginState(prev => ({ ...prev, loading: false }));
  };

  // Envía los datos de registro al backend; si el registro tiene éxito el
  // backend devuelve token igual que el login, por lo que reutiliza onLogin.
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterState(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerState.email, password: registerState.password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        saveToken(data.token);
        onLogin(data.token);  // ← Pasa el token aquí
      } else {
        setRegisterState(prev => ({ ...prev, error: data.msg || 'Error al registrar' }));
      }
    } catch (err) {
      setRegisterState(prev => ({ ...prev, error: 'Error de red' }));
    }
    setRegisterState(prev => ({ ...prev, loading: false }));
  };

  return (
    <div
      className="login-page"
      style={{
        // Fondo en WebP con nombre fijo (public/img) para poder precargarlo desde index.html
        '--login-bg-small': `url(${process.env.PUBLIC_URL}/img/login-bg-1080.webp)`,
        '--login-bg-large': `url(${process.env.PUBLIC_URL}/img/login-bg-1920.webp)`,
      }}
    >
      <div className="login-card">
        <img src={require('img/fitcor logo.png')} alt="Fitcor Logo" className="login-logo" />
        <div className="login-title">Iniciar sesión</div>
        {/* Formulario de inicio de sesión: llama a handleSubmit al enviarse */}
        <form ref={loginFormRef} onSubmit={handleSubmit} className="login-form">
          <label className="login-label">Usuario</label>
          <div className="login-input-wrap">
            <input
              type="email"
              placeholder="Email"
              value={loginState.email}
              onChange={e => setLoginState(prev => ({ ...prev, email: e.target.value }))}
          required
              className="login-input login-input--shadow"
        />
          </div>
          <label className="login-label">Contraseña</label>
          <div className="login-input-wrap">
            <input
              type={loginState.showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={loginState.password}
              onChange={e => setLoginState(prev => ({ ...prev, password: e.target.value }))}
            required
              className="login-input login-input--shadow"
          />
          <button
            type="button"
            onClick={() => setLoginState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
              className="login-eye-toggle"
            tabIndex={-1}
            aria-label={loginState.showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {loginState.showPassword ? '🙈' : '👁️'}
          </button>
        </div>
          <div className="login-remember-row">
            <input type="checkbox" id="remember" checked={loginState.remember} onChange={e => setLoginState(prev => ({ ...prev, remember: e.target.checked }))} className="login-checkbox" />
            <label htmlFor="remember" className="login-remember-label">Recordar datos</label>
          </div>
          {loginState.error && <div className="login-error login-error--center">{loginState.error}</div>}
        <button
          type="submit"
          disabled={loginState.loading}
            className="login-btn-primary"
        >
          {loginState.loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>
          {/* Acceso directo sin autenticarse contra el backend: onLogin('guest') */}
          <button
            type="button"
            className="login-btn-guest"
            onClick={() => onLogin('guest')}
          >
            Entrar como invitado
          </button>
      </form>
        <div className="login-bottom-wrap">
        {/* Alterna entre el enlace "Regístrate" y el formulario de registro completo */}
        {!uiState.showRegister ? (
            <button type="button" className="login-toggle-link" onClick={() => setUiState(prev => ({ ...prev, showRegister: true }))}>
              ¿No tienes cuenta? <span className="login-toggle-highlight">Regístrate</span>
          </button>
        ) : (
            <form ref={registerFormRef} onSubmit={handleRegister} className="login-register-form">
            <input
              type="email"
              placeholder="Email"
              value={registerState.email}
              onChange={e => setRegisterState(prev => ({ ...prev, email: e.target.value }))}
              required
                className="login-input login-input--spaced"
            />
              <div className="login-input-wrap">
              <input
                type={registerState.showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={registerState.password}
                onChange={e => setRegisterState(prev => ({ ...prev, password: e.target.value }))}
                required
                  className="login-input"
              />
              <button
                type="button"
                onClick={() => setRegisterState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="login-eye-toggle"
                tabIndex={-1}
                aria-label={registerState.showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {registerState.showPassword ? '🙈' : '👁️'}
              </button>
            </div>
              {registerState.error && <div className="login-error">{registerState.error}</div>}
            <button
              type="submit"
              disabled={registerState.loading}
                className="login-btn-primary"
            >
              {registerState.loading ? 'Registrando...' : 'Registrarse'}
            </button>
              <button
                type="button"
                className="login-btn-guest"
                onClick={() => onLogin('guest')}
              >
                Entrar como invitado
              </button>
              <button type="button" className="login-toggle-link login-toggle-link--spaced" onClick={() => setUiState(prev => ({ ...prev, showRegister: false }))}>
              Volver al login
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default Login; 