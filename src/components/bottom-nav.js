import React from 'react';
import PropTypes from 'prop-types';
import 'components/css/bottom-nav.css';

// Definición de las pestañas de la barra de navegación inferior: id (usado para
// comparar con tabActiva y navegar), icono y etiqueta visible.
const tabs = [
  { id: 'inicio', icon: '🏠', label: 'Inicio' },
  { id: 'entrenamiento', icon: '💪', label: 'Entrenamiento' },
  { id: 'progreso', icon: '📈', label: 'Progreso' },
  { id: 'clubs', icon: '📍', label: 'Clubs' },
];

// Barra de navegación principal entre las pantallas de la app.
// tabActiva indica qué pestaña está seleccionada; setTabActiva la cambia (lo gestiona el padre).
function BottomNav({ tabActiva, setTabActiva }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          // Resalta la pestaña activa añadiendo la clase 'active'
          className={`nav-btn${tabActiva === tab.id ? ' active' : ''}`}
          onClick={() => setTabActiva(tab.id)}
        >
          <span className="nav-icon-bg">
            <span className="nav-icon">{tab.icon}</span>
          </span>
          <div>{tab.label}</div>
        </button>
      ))}
    </nav>
  );
}

// Validación de las props que recibe BottomNav
BottomNav.propTypes = {
  tabActiva: PropTypes.string.isRequired,
  setTabActiva: PropTypes.func.isRequired,
};

export default BottomNav; 