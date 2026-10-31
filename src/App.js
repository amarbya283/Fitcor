import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from 'components/header';
import BottomNav from 'components/bottom-nav';
import Login from 'components/login';
import { ToastProvider } from 'components/toast';
import { AuthProvider, useAuth } from 'context/auth-context';
import 'components/css/home.css';
import './App.css';

// Lazy loading para mejorar rendimiento. Home también se carga bajo demanda: así la
// pantalla de login no descarga la portada (carruseles, código QR...) hasta iniciar sesión.
const Home = lazy(() => import('components/home'));
const Perfil = lazy(() => import('paginas/perfil'));
const Entrenamiento = lazy(() => import('paginas/entrenamiento'));
const Progreso = lazy(() => import('paginas/progreso'));
const Clubs = lazy(() => import('paginas/clubs'));
const Temporizador = lazy(() => import('paginas/temporizador'));
const CrearRutina = lazy(() => import('paginas/crear-rutina'));

// Componente principal de la aplicación
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado agrupado para mejor organización
  const [appState, setAppState] = useState({
    fotoPerfil: null,
    memberID: '',
    tempoConfig: {
      esfuerzo: 20,
      descanso: 10,
      ejercicios: 8,
      rondas: 2,
      reposo: 60,
      sonido: true,
    },
    showTempo: false,
    rutinas: []
  });

  // Estado de autenticación (token / isLogged / login / logout) provisto por AuthContext
  const { token, isLogged, login, handleLogout } = useAuth();

  // Función para manejar cambios de navegación
  const handleTabChange = (tab) => {
    setAppState(prev => ({ ...prev, showTempo: false }));
    
    switch (tab) {
      case 'inicio':
        navigate('/');
        break;
      case 'perfil':
        navigate('/perfil');
        break;
      case 'entrenamiento':
        navigate('/entrenamiento');
        break;
      case 'progreso':
        navigate('/progreso');
        break;
      case 'clubs':
        navigate('/clubs');
        break;
      default:
        navigate('/');
    }
  };

  // Obtener tab activa basada en la ruta actual
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'inicio';
    if (path === '/perfil') return 'perfil';
    if (path === '/entrenamiento') return 'entrenamiento';
    if (path === '/progreso') return 'progreso';
    if (path === '/clubs') return 'clubs';
    return 'inicio';
  };

  if (!isLogged) {
  return <Login onLogin={login} />;
}

  return (
    <div className="main-container with-bottom-bar">
      <Header 
        onAvatarClick={() => handleTabChange('perfil')} 
        foto={appState.fotoPerfil} 
      />
      
      <Suspense fallback={<div className="app-loading-fallback">Cargando...</div>}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onVerVisitas={() => handleTabChange('progreso')}
                onVerTodo={() => handleTabChange('entrenamiento')}
                onAvatarClick={() => handleTabChange('perfil')}
              />
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <Perfil 
                onBack={() => handleTabChange('inicio')} 
                foto={appState.fotoPerfil} 
                setFoto={(foto) => setAppState(prev => ({ ...prev, fotoPerfil: foto }))}
                memberID={appState.memberID} 
                setMemberID={(id) => setAppState(prev => ({ ...prev, memberID: id }))}
                onLogout={handleLogout} 
              />
            } 
          />
          <Route 
            path="/entrenamiento" 
            element={
              <Entrenamiento
                tempoConfig={appState.tempoConfig}
                setTempoConfig={(config) => setAppState(prev => ({ ...prev, tempoConfig: config }))}
                showTempo={appState.showTempo}
                setShowTempo={(show) => setAppState(prev => ({ ...prev, showTempo: show }))}
                onCrearRutina={() => navigate('/crearrutina')}
              />
            } 
          />
          <Route 
            path="/crearrutina" 
            element={
              <CrearRutina
                onBack={() => navigate('/entrenamiento')}
                rutinas={appState.rutinas}
                addRutina={(r) => setAppState(prev => ({ ...prev, rutinas: [...prev.rutinas, r] }))}
                token={token}
              />
            } 
          />
          <Route 
            path="/progreso" 
            element={
              <Progreso 
                onGotoEntrenamiento={() => handleTabChange('entrenamiento')} 
              />
            } 
          />
          <Route 
            path="/clubs" 
            element={<Clubs />} 
          />
          <Route 
            path="/temporizador" 
            element={<Temporizador />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      
      <BottomNav 
        tabActiva={getActiveTab()} 
        setTabActiva={handleTabChange} 
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastProvider />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;