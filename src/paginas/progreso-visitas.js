import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gimnasioImg from 'img/gimnasio.jpg';
import 'paginas/css/progreso-tabs.css';
import 'paginas/css/progreso-visitas.css';

// Historial de visitas de ejemplo. Con datos reales esta lista vendría de la API;
// aquí sirve para mostrar el diseño de la pantalla.
const visitasEjemplo = [
  {
    club: 'FITCOR A CORUÑA AVENIDA DE CASTELO',
    fecha: '2025-07-07',
    hora: '09:26:32',
    img: gimnasioImg
  },
  {
    club: 'FITCOR SEGOVIA AVENIDA DEL OBISPO QUESADA',
    fecha: '2025-07-06',
    hora: '20:09:23',
    img: gimnasioImg
  },
  {
    club: 'FITCOR BURGOS CALLE SERRAMAGNA',
    fecha: '2025-05-27',
    hora: '17:23:16',
    img: gimnasioImg
  },
  {
    club: 'FITCOR MADRID CALLE ESCOBAR',
    fecha: '2025-04-27',
    hora: '18:23:10',
    img: gimnasioImg
  },
  {
    club: 'FITCOR MADRID CALLE ESCOBAR',
    fecha: '2025-04-26',
    hora: '15:03:10',
    img: gimnasioImg
  },
  {
    club: 'FITCOR SEGOVIA AVENIDA DEL OBISPO QUESADA',
    fecha: '2025-03-26',
    hora: '20:09:23',
    img: gimnasioImg
  },
  {
    club: 'FITCOR BURGOS CALLE DE LA PLAZA',
    fecha: '2025-03-24',
    hora: '18:19:23',
    img: gimnasioImg
  }
].map(v => ({...v, club: v.club.replace(/^GYM-FIT/, 'FITCOR')}));
// El replace normaliza los nombres antiguos: el gimnasio se llamaba GYM-FIT
// antes del cambio de marca a FITCOR

// Periodos por los que se puede filtrar el historial
const subTabs = ['Semana', 'Mes', 'Año'];

// Pestaña "Visitas" de la sección Progreso: resumen de visitas al club e historial.
// activeTab y onTabChange los controla el padre (progreso.js), que decide qué pestaña
// se muestra; subTab (Semana/Mes/Año) es propio de esta pantalla.
function ProgresoVisitas({ onTabChange, activeTab = 'Visitas' }) {
  const [subTab, setSubTab] = useState('Año');

  return (
    <div className="ptabs-container">
      {/* Tabs superiores */}
      <div className="ptabs-tabs">
        {['Mis datos', 'Entrenamientos', 'Visitas', 'Insignias'].map(tab => (
          <div
            key={tab}
            onClick={() => onTabChange && onTabChange(tab)}
            className={`ptabs-tab ${activeTab === tab ? 'ptabs-tab--activa' : ''}`}
          >
            {tab}
          </div>
        ))}
      </div>
      {/* Sub-tabs */}
      <div className="ptabs-subtabs">
        {subTabs.map(st => (
          <button
            key={st}
            onClick={() => setSubTab(st)}
            className={`ptabs-subtab ${subTab === st ? 'ptabs-subtab--activa' : ''}`}
          >
            {st}
          </button>
        ))}
      </div>
      {/* Estadísticas */}
      <div className="visitas-stats">
        <div className="visitas-stat-card">
          <div className="visitas-stat-value">56</div>
          <div className="visitas-stat-label">ESTE AÑO</div>
        </div>
        <div className="visitas-stat-card">
          <div className="visitas-stat-value">56</div>
          <div className="visitas-stat-label">TOTAL</div>
        </div>
      </div>
      {/* Historial */}
      <div className="visitas-historial-header">Tu historial</div>
      <div>
        {/* key por fecha: cada visita del historial tiene una fecha distinta,
            así que identifica la fila mejor que el índice */}
        {visitasEjemplo.map((v) => (
          <div key={v.fecha} className="visitas-card">
            <img src={v.img} alt={v.club} className="visitas-card-img" />
            <div className="visitas-card-body">
              <div className="visitas-card-club">{v.club}</div>
              <div className="visitas-card-meta">{v.fecha} - {v.hora}</div>
            </div>
          </div>
        ))}
        {/* Espaciador para scroll extra */}
        <div className="visitas-spacer" />
      </div>
    </div>
  );
}

// Validación de las props que recibe ProgresoVisitas
ProgresoVisitas.propTypes = {
  onTabChange: PropTypes.func,
  activeTab: PropTypes.string,
};

export default ProgresoVisitas;
