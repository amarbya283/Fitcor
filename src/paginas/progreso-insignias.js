import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'paginas/css/progreso-insignias.css';

const mainTabs = ['Mis datos', 'Entrenamientos', 'Visitas', 'Insignias'];

const rachas = [
  // Fila 1
  { titulo: '2 semanas seguidas', fecha: '07/07/2025', img: require('img/insignia1.png'), conseguido: true },
  { titulo: '15 visitas al club', fecha: '30/04/2025', img: require('img/insignia2.png'), conseguido: true },
  { titulo: '4 visitas en 7 días', fecha: '05/05/2025', img: require('img/insignia3.png'), conseguido: true },
  { titulo: '5 clases seguidas', fecha: '', img: require('img/insignia4.png'), conseguido: false },
  // Fila 2
  { titulo: '125 visitas', fecha: '', img: require('img/insignia5.png'), conseguido: false },
  { titulo: '10 visitas en 14 días', fecha: '', img: require('img/insignia6.png'), conseguido: false },
  { titulo: '3 meses seguidos', fecha: '', img: require('img/insignia7.png'), conseguido: false },
  { titulo: '2000 min al año', fecha: '', img: require('img/insignia8.png'), conseguido: false },
  // Fila 3
  { titulo: '10 visitas en 14 días', fecha: '', img: require('img/insignia9.png'), conseguido: false },
  { titulo: '30 clases', fecha: '', img: require('img/insignia10.png'), conseguido: false },
  { titulo: 'Frecuencia imparable', fecha: '', img: require('img/insignia11.png'), conseguido: false },
  { titulo: '3 clases seguidas', fecha: '', img: require('img/insignia12.png'), conseguido: false },
];

function ProgresoInsignias({ activeTab = 'Insignias', onTabChange }) {
  const [insigniaModal, setInsigniaModal] = useState(null);

  return (
    <div className="insignias-container">
      {/* Tabs superiores */}
      <div className="insignias-tabs">
        {mainTabs.map(tab => (
          <div
            key={tab}
            onClick={() => onTabChange && onTabChange(tab)}
            className={`insignias-tab ${activeTab === tab ? 'insignias-tab--activa' : ''}`}
          >
            {tab}
          </div>
        ))}
      </div>
      {/* Próximo objetivo */}
      <div className="insignias-objetivo">
        <div className="insignias-objetivo-row">
          <img src={require('img/insignia11.png')} alt="Insignia 11" className="insignias-objetivo-img" />
          <div className="insignias-objetivo-info">
            <div className="insignias-objetivo-label">TU PRÓXIMO OBJETIVO</div>
            <div className="insignias-objetivo-bar" />
            <div className="insignias-objetivo-titulo">3 semanas seguidas</div>
            <div className="insignias-objetivo-desc">¡Llevas 2 semanas seguidas!<br/>Sigue yendo al gym para mantener esta buena racha.</div>
          </div>
        </div>
      </div>
      {/* Rachas */}
      <div className="insignias-rachas">
        <div className="insignias-rachas-label">RACHAS</div>
        <div className="insignias-rachas-desc">Visita el gimnasio al menos una vez por semana.<br/>¡Escanea tu código QR o tarjeta del club para registrar tu visita!</div>
        <div className="insignias-grid">
          {/* key=racha.img (no titulo): dos entradas comparten el mismo titulo
              '10 visitas en 14 días' pero cada una usa una imagen distinta */}
          {rachas.map((racha) => (
            <div key={racha.img} className="insignias-item">
              <img
                src={racha.img}
                alt={racha.titulo}
                className={`insignias-img ${racha.conseguido ? 'insignias-img--conseguida' : ''}`}
                onClick={() => setInsigniaModal(racha)}
              />
              <div className={`insignias-item-titulo ${racha.conseguido ? 'insignias-item-titulo--conseguida' : ''}`}>{racha.titulo}</div>
              <div className="insignias-item-fecha">{racha.conseguido && racha.fecha}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal insignia grande */}
      {insigniaModal && (
        <div className="insignias-modal-overlay">
          <div className="insignias-modal">
            <img
              src={insigniaModal.img}
              alt={insigniaModal.titulo}
              className={`insignias-modal-img ${insigniaModal.conseguido ? 'insignias-modal-img--conseguida' : ''}`}
            />
            <div className={`insignias-modal-titulo ${insigniaModal.conseguido ? 'insignias-modal-titulo--conseguida' : ''}`}>{insigniaModal.titulo}</div>
            {insigniaModal.conseguido && <div className="insignias-modal-fecha">{insigniaModal.fecha}</div>}
            <button onClick={() => setInsigniaModal(null)} className="insignias-modal-cerrar">Cerrar</button>
          </div>
        </div>
      )}
      {/* Espaciador para scroll extra */}
      <div className="insignias-spacer" />
    </div>
  );
}

// Validación de las props que recibe ProgresoInsignias
ProgresoInsignias.propTypes = {
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default ProgresoInsignias;
