import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'paginas/css/progreso-datos.css';

const mainTabs = ['Mis datos', 'Entrenamientos', 'Visitas', 'Insignias'];

function calcularIMC(peso, altura) {
  if (!peso || !altura) return null;
  const alturaM = altura / 100;
  return Math.round((peso / (alturaM * alturaM)) * 10) / 10;
}

function ProgresoDatos({ activeTab = 'Mis datos', onTabChange }) {
  // Estados agrupados por finalidad:
  // - modales: qué ventana está abierta
  // - datosIMC: peso, altura e IMC calculado (se guardan en localStorage)
  // - ajustes: estado físico elegido y si Health Connect está activado
  const [modales, setModales] = useState({ imc: false, composicion: false, health: false, logros: false });
  const [datosIMC, setDatosIMC] = useState({ peso: '', altura: '', imc: 34 });
  const [ajustes, setAjustes] = useState({ estadoFisico: 'Normal', healthConnect: false });
  const { peso, altura, imc } = datosIMC;
  const { estadoFisico, healthConnect } = ajustes;

  // Abre o cierra un modal concreto conservando el estado de los demás
  const cambiarModal = (nombre, abierto) => setModales(prev => ({ ...prev, [nombre]: abierto }));

  // Recupera los datos de IMC guardados en una visita anterior
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('datosIMC') || '{}');
    setDatosIMC(prev => ({
      ...prev,
      peso: datos.peso || prev.peso,
      altura: datos.altura || prev.altura,
      imc: datos.peso && datos.altura ? calcularIMC(Number(datos.peso), Number(datos.altura)) : prev.imc,
    }));
  }, []);

  const handleGuardarIMC = () => {
    if (!peso || !altura) return;
    const nuevoIMC = calcularIMC(Number(peso), Number(altura));
    setDatosIMC(prev => ({ ...prev, imc: nuevoIMC }));
    localStorage.setItem('datosIMC', JSON.stringify({ peso, altura }));
    cambiarModal('imc', false);
  };

  // Valores de ejemplo
  let masaGrasa = 43, masaMuscular = 54;
  if (estadoFisico === 'Delgado/a') {
    masaGrasa = 15; masaMuscular = 82;
  } else if (estadoFisico === 'Normal') {
    masaGrasa = 25; masaMuscular = 72;
  } else if (estadoFisico === 'Fuerte/Musculoso/a') {
    masaGrasa = 13; masaMuscular = 84;
  } else if (estadoFisico === 'Con sobrepeso') {
    masaGrasa = 43; masaMuscular = 54;
  }
  const masaOsea = 3;
  const total = masaGrasa + masaMuscular + masaOsea;
  const circ = 2 * Math.PI * 36; // Perímetro del círculo (r=36)
  // Cálculo de longitudes proporcionales
  const grasaLen = (masaGrasa / total) * circ;
  const musculoLen = (masaMuscular / total) * circ;
  const oseaLen = (masaOsea / total) * circ;

  // Logros con imagen individual y conseguido
  const logros = [
    { titulo: '2 semanas seguidas', fecha: '07/07/2025', img: require('img/insignia1.png'), conseguido: true },
    { titulo: '15 visitas al club', fecha: '06/07/2025', img: require('img/insignia2.png'), conseguido: true },
    { titulo: '4 visitas en 7 días', fecha: '05/05/2025', img: require('img/insignia3.png'), conseguido: true },
    { titulo: '5 clases seguidas', fecha: '', img: require('img/insignia4.png'), conseguido: false },
    { titulo: '125 visitas', fecha: '', img: require('img/insignia5.png'), conseguido: false },
    { titulo: '10 visitas en 14 días', fecha: '', img: require('img/insignia6.png'), conseguido: false },
    { titulo: '3 meses seguidos', fecha: '', img: require('img/insignia7.png'), conseguido: false },
    { titulo: '2000 min al año', fecha: '', img: require('img/insignia8.png'), conseguido: false },
    { titulo: '10 visitas en 14 días', fecha: '', img: require('img/insignia9.png'), conseguido: false },
    { titulo: '30 clases', fecha: '', img: require('img/insignia10.png'), conseguido: false },
    { titulo: 'Frecuencia imparable', fecha: '', img: require('img/insignia11.png'), conseguido: false },
    { titulo: '3 clases seguidas', fecha: '', img: require('img/insignia12.png'), conseguido: false },
  ];
  const numCols = 3;
  const numRows = 4;

  return (
    <div className="progreso-container" style={{ '--sprite-insignias': `url(${require('img/imagenesinsignias.png')})` }}>
      {/* Tabs superiores */}
      <div className="progreso-tabs">
        {mainTabs.map((tab) => (
          <div
            key={tab}
            onClick={() => onTabChange && onTabChange(tab)}
            className={`progreso-tab ${activeTab === tab ? 'progreso-tab--activa' : ''}`}
          >
            {tab}
          </div>
        ))}
      </div>
      {/* INSIGNIAS: solo si la pestaña activa es 'Insignias' */}
      {activeTab === 'Insignias' && (
        <div>
          {/* Próximo objetivo */}
          <div className="progreso-objetivo-card">
            <div className="progreso-objetivo-row">
              <div className="progreso-sprite-insignia progreso-sprite-insignia--objetivo" />
              <div className="progreso-objetivo-info">
                <div className="progreso-objetivo-label">TU PRÓXIMO OBJETIVO</div>
                <div className="progreso-objetivo-bar" />
                <div className="progreso-objetivo-titulo">3 semanas seguidas</div>
                <div className="progreso-objetivo-desc">¡Llevas 2 semanas seguidas!<br/>Sigue yendo al gym para mantener esta buena racha.</div>
              </div>
            </div>
          </div>
          {/* Rachas */}
          <div className="progreso-rachas-card">
            <div className="progreso-rachas-label">RACHAS</div>
            <div className="progreso-rachas-desc">Visita el gimnasio al menos una vez por semana.<br/>¡Escanea tu código QR o tarjeta del club para registrar tu visita!</div>
            <div className="progreso-rachas-grid">
              {/* Ejemplo de rachas, puedes ajustar col/fila y conseguido según tus datos */}
              {[
                { titulo: '2 semanas seguidas', fecha: '07/07/2025', col: 0, fila: 0, conseguido: true },
                { titulo: '3 semanas seguidas', fecha: '30/04/2025', col: 1, fila: 0, conseguido: true },
                { titulo: '4 semanas seguidas', fecha: '05/05/2025', col: 2, fila: 0, conseguido: true },
                { titulo: '10 semanas seguidas', fecha: '', col: 0, fila: 1, conseguido: false },
                { titulo: '15 semanas seguidas', fecha: '', col: 1, fila: 1, conseguido: false },
                { titulo: '20 semanas seguidas', fecha: '', col: 2, fila: 1, conseguido: false },
              ].map((racha) => (
                <div key={racha.titulo} className="progreso-racha-item">
                  <div
                    className={`progreso-sprite-insignia progreso-sprite-insignia--racha ${racha.conseguido ? 'progreso-sprite-insignia--conseguido' : ''}`}
                    style={{ '--sprite-x': `${(racha.col * 100) / (numCols - 1)}%`, '--sprite-y': `${(racha.fila * 100) / (numRows - 1)}%` }}
                  />
                  <div className={`progreso-racha-titulo ${racha.conseguido ? 'progreso-racha-titulo--conseguido' : ''}`}>{racha.titulo}</div>
                  <div className="progreso-racha-fecha">{racha.conseguido && racha.fecha}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Últimos logros */}
      <div className="progreso-logros-card">
        <div className="progreso-logros-header">
          <span className="progreso-logros-titulo">ÚLTIMOS LOGROS</span>
          <span className="progreso-logros-vertodo" onClick={() => cambiarModal('logros', true)}>Ver todo</span>
        </div>
        <div className="progreso-logros-list">
          {logros.length === 0 ? (
            <div className="progreso-logros-empty">
              <span className="progreso-logros-empty-icon">🚀</span>
              ¡Aún no tienes logros!<br/>¡Sigue entrenando y los conseguirás!
            </div>
          ) : (
            // key=logro.img (no titulo): '10 visitas en 14 días' aparece dos veces
            // en la lista con imágenes distintas, así que titulo no es único aquí.
            logros.map((logro) => (
              <div key={logro.img} className="progreso-logro-card">
                <img
                  src={logro.img}
                  alt={logro.titulo}
                  className={`progreso-logro-img ${logro.conseguido ? 'progreso-logro-img--conseguido' : ''}`}
                />
                <div className="progreso-logro-titulo">{logro.titulo}</div>
                <div className="progreso-logro-fecha">{logro.fecha}</div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Modal de logros completos */}
      {modales.logros && (
        <div className="progreso-modal-overlay progreso-modal-overlay--top">
          <div className="progreso-modal-card progreso-modal-card--center progreso-modal-card--lg">
            <div className="progreso-modal-titulo">Todas las insignias</div>
            <div className="progreso-modal-logros-grid">
              {logros.map((logro) => (
                <div key={logro.img} className="progreso-modal-logro-item">
                  <img
                    src={logro.img}
                    alt={logro.titulo}
                    className={`progreso-modal-logro-img ${logro.conseguido ? 'progreso-modal-logro-img--conseguido' : ''}`}
                  />
                  <div className={`progreso-modal-logro-titulo ${logro.conseguido ? 'progreso-modal-logro-titulo--conseguido' : ''}`}>{logro.titulo}</div>
                  <div className="progreso-modal-logro-fecha">{logro.conseguido && logro.fecha}</div>
                </div>
              ))}
            </div>
            <button onClick={() => cambiarModal('logros', false)} className="progreso-btn-primary">Cerrar</button>
          </div>
        </div>
      )}
      {/* Tarjetas Peso, Calorías, Pasos */}
      <div className="progreso-stats-card">
        {/* Peso */}
        <div className="progreso-stat-row progreso-stat-row--primero">
          <div>
            <div className="progreso-stat-label">Peso</div>
            <div className="progreso-stat-value progreso-stat-value--grande">{peso || '0'}<span className="progreso-stat-unit progreso-stat-unit--grande">&nbsp;Kg</span></div>
          </div>
          <span className="progreso-card-arrow">→</span>
        </div>
        {/* Gráfico peso */}
        <div className="progreso-stat-chart-wrap">
          <svg width="100%" height="32" viewBox="0 0 120 32">
            <polyline fill="none" stroke="var(--brand-orange)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points="5,25 20,18 35,20 50,15 65,17 80,14 95,16 110,13" />
            <circle cx="110" cy="13" r="3" fill="var(--brand-orange)" />
          </svg>
        </div>
        {/* Calorías */}
        <div className="progreso-stat-row">
          <div>
            <div className="progreso-stat-label">Calorías quemadas</div>
            <div className="progreso-stat-value">0<span className="progreso-stat-unit">&nbsp;Kcal</span></div>
          </div>
          <span className="progreso-card-arrow">→</span>
        </div>
        <div className="progreso-stat-chart-wrap">
          <svg width="100%" height="32" viewBox="0 0 120 32">
            {/* Barras del gráfico de calorías (datos de ejemplo). Cada barra lleva su
                propio id para no usar el índice como key; el índice solo sirve para
                calcular la posición horizontal. */}
            {[
              { id: 'cal-lun', alto: 8 },
              { id: 'cal-mar', alto: 12 },
              { id: 'cal-mie', alto: 10 },
              { id: 'cal-jue', alto: 14 },
              { id: 'cal-vie', alto: 9 },
              { id: 'cal-sab', alto: 13 },
              { id: 'cal-dom', alto: 11 },
            ].map((barra, i) => (
              <rect key={barra.id} x={5 + i * 16} y={32 - barra.alto * 2} width="10" height={barra.alto * 2} rx="4" fill="#4de3d1" />
            ))}
          </svg>
        </div>
        {/* Pasos */}
        <div className="progreso-stat-row">
          <div>
            <div className="progreso-stat-label">Pasos</div>
            <div className="progreso-stat-value">{healthConnect ? '0' : '0'}<span className="progreso-stat-unit">&nbsp;Pasos dados</span></div>
          </div>
          <span className="progreso-card-arrow">→</span>
        </div>
        <div className="progreso-stat-chart-wrap progreso-stat-chart-wrap--ultimo">
          <svg width="100%" height="32" viewBox="0 0 120 32">
            {/* Mismo gráfico para los pasos diarios, con sus propios identificadores */}
            {[
              { id: 'pasos-lun', alto: 8 },
              { id: 'pasos-mar', alto: 12 },
              { id: 'pasos-mie', alto: 10 },
              { id: 'pasos-jue', alto: 14 },
              { id: 'pasos-vie', alto: 9 },
              { id: 'pasos-sab', alto: 13 },
              { id: 'pasos-dom', alto: 11 },
            ].map((barra, i) => (
              <rect key={barra.id} x={5 + i * 16} y={32 - barra.alto * 2} width="10" height={barra.alto * 2} rx="4" fill="#4de3d1" />
            ))}
          </svg>
        </div>
      </div>
      {/* Composición corporal */}
      <div className="progreso-card">
        <div className="progreso-card-header">
          <div className="progreso-card-header-label">COMPOSICIÓN CORPORAL</div>
          <span className="progreso-card-arrow" onClick={() => cambiarModal('composicion', true)}>→</span>
        </div>
        <div className="progreso-compo-fecha">Última medición: 27/05/2025</div>
        {imc && (
          <div className="progreso-compo-imc">
            IMC actual: {imc}
          </div>
        )}
        <div className="progreso-compo-row">
          <div>
            <div className="progreso-compo-legend-item">
              <span className="progreso-compo-dot progreso-compo-dot--grasa"></span>
              <span className="progreso-compo-legend-text">Masa grasa</span>
              <span className="progreso-compo-legend-value">{masaGrasa}%</span>
            </div>
            <div className="progreso-compo-legend-item">
              <span className="progreso-compo-dot progreso-compo-dot--muscular"></span>
              <span className="progreso-compo-legend-text">Masa muscular</span>
              <span className="progreso-compo-legend-value">{masaMuscular}%</span>
            </div>
            <div className="progreso-compo-legend-item">
              <span className="progreso-compo-dot progreso-compo-dot--osea"></span>
              <span className="progreso-compo-legend-text">Masa ósea</span>
              <span className="progreso-compo-legend-value">{masaOsea}%</span>
            </div>
          </div>
          <svg width="90" height="90" viewBox="0 0 90 90" className="progreso-compo-svg">
            <circle cx="45" cy="45" r="36" stroke="#eee" strokeWidth="14" fill="none" />
            {/* Masa grasa */}
            <circle cx="45" cy="45" r="36" stroke="var(--brand-orange)" strokeWidth="14" fill="none" strokeDasharray={`${grasaLen} ${circ - grasaLen}`} strokeDashoffset="0" className="progreso-circulo-composicion" transform="rotate(-90 45 45)" />
            {/* Masa muscular */}
            <circle cx="45" cy="45" r="36" stroke="#4de37a" strokeWidth="14" fill="none" strokeDasharray={`${musculoLen} ${circ - musculoLen}`} strokeDashoffset={`-${grasaLen}`} className="progreso-circulo-composicion" transform="rotate(-90 45 45)" />
            {/* Masa ósea */}
            <circle cx="45" cy="45" r="36" stroke="#222" strokeWidth="14" fill="none" strokeDasharray={`${oseaLen} ${circ - oseaLen}`} strokeDashoffset={`-${grasaLen + musculoLen}`} className="progreso-circulo-composicion" transform="rotate(-90 45 45)" />
          </svg>
        </div>
      </div>
      {/* Modal para composición corporal */}
      {modales.composicion && (
        <div className="progreso-modal-overlay">
          <div className="progreso-modal-card progreso-modal-card--center progreso-modal-card--sm">
            <div className="progreso-modal-titulo">Selecciona tu estado físico</div>
            <div className="progreso-modal-estado-options">
              {['Delgado/a', 'Normal', 'Fuerte/Musculoso/a', 'Con sobrepeso'].map(op => (
                <button
                  key={op}
                  onClick={() => setAjustes(prev => ({ ...prev, estadoFisico: op }))}
                  className={`progreso-btn-estado ${estadoFisico === op ? 'progreso-btn-estado--seleccionado' : ''}`}
                >
                  {op}
                </button>
              ))}
            </div>
            <button onClick={() => cambiarModal('composicion', false)} className="progreso-btn-primary">Guardar</button>
            <button onClick={() => cambiarModal('composicion', false)} className="progreso-btn-secondary">Cancelar</button>
          </div>
        </div>
      )}
      {/* IMC */}
      <div className="progreso-card">
        <div className="progreso-card-header">
          <div className="progreso-card-header-label">MI IMC</div>
          <span className="progreso-card-arrow" onClick={() => cambiarModal('imc', true)}>→</span>
        </div>
        <div className="progreso-imc-valor">{imc}</div>
        <div className="progreso-imc-subtitulo">Basado en tu peso y estatura</div>
        <div className="progreso-imc-bar-row">
          <div className="progreso-imc-bar-track">
            <div className="progreso-imc-marker" style={{ '--imc-marker-left': `${imc <= 18.5 ? 0 : imc <= 24.9 ? 25 : imc <= 29.9 ? 50 : 75}%` }}></div>
            <div className="progreso-imc-bar-segment progreso-imc-bar-segment--1"></div>
            <div className="progreso-imc-bar-segment progreso-imc-bar-segment--2"></div>
            <div className="progreso-imc-bar-segment progreso-imc-bar-segment--3"></div>
            <div className="progreso-imc-bar-segment progreso-imc-bar-segment--4"></div>
          </div>
        </div>
        <div className="progreso-imc-labels">
          <span>Peso bajo</span>
          <span>Saludable</span>
          <span>Sobrepeso</span>
          <span className="progreso-imc-labels-obesidad">Obesidad</span>
        </div>
      </div>
      {/* Modal para calcular IMC */}
      {modales.imc && (
        <div className="progreso-modal-overlay">
          <div className="progreso-modal-card progreso-modal-card--sm">
            <div className="progreso-modal-titulo">Calcular IMC</div>
            <label className="progreso-imc-label">
              Peso (kg):
              <input type="number" value={peso} onChange={e => setDatosIMC(prev => ({ ...prev, peso: e.target.value }))} className="progreso-imc-input" />
            </label>
            <label className="progreso-imc-label">
              Altura (cm):
              <input type="number" value={altura} onChange={e => setDatosIMC(prev => ({ ...prev, altura: e.target.value }))} className="progreso-imc-input" />
            </label>
            <button onClick={handleGuardarIMC} className="progreso-btn-primary">Guardar</button>
            <button onClick={() => cambiarModal('imc', false)} className="progreso-btn-secondary">Cancelar</button>
          </div>
        </div>
      )}
      {/* Health Connect */}
      <div className="progreso-card progreso-health-card">
        <div className="progreso-health-left">
          <span className="progreso-health-icon">❤️</span>
          <span className="progreso-health-titulo">Health Connect</span>
        </div>
        <label className="progreso-health-toggle-label">
          <input type="checkbox" checked={healthConnect} onChange={e => { const activo = e.target.checked; setAjustes(prev => ({ ...prev, healthConnect: activo })); if (activo) cambiarModal('health', true); }} className="progreso-health-checkbox" />
          <span className={`progreso-toggle ${healthConnect ? 'progreso-toggle--activo' : ''}`}>
            <span className={`progreso-toggle-knob ${healthConnect ? 'progreso-toggle-knob--activo' : ''}`}></span>
          </span>
        </label>
      </div>
      {/* Espaciador para scroll extra */}
      <div className="progreso-spacer" />
      {/* Modal Health Connect */}
      {modales.health && (
        <div className="progreso-modal-overlay">
          <div className="progreso-modal-card progreso-modal-card--center progreso-modal-card--md">
            <span className="progreso-health-modal-icon">📱</span>
            <div className="progreso-health-modal-titulo">Próximamente: Conexión con Google Fit</div>
            <div className="progreso-health-modal-texto">
              Podrás ver tus pasos reales y otros datos de salud conectando tu cuenta de Google Fit desde la app móvil.<br/><br/>
              ¡Muy pronto disponible en FITCOR!
            </div>
            <button onClick={() => cambiarModal('health', false)} className="progreso-btn-primary">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Validación de las props que recibe ProgresoDatos
ProgresoDatos.propTypes = {
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default ProgresoDatos;
