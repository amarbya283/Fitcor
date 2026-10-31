import React from 'react';
import PropTypes from 'prop-types';
import Temporizador from 'paginas/temporizador';
import 'paginas/css/entrenamiento.css';

// Tarjetas informativas de tipos de entrenamiento mostradas en la pantalla de Entrenamiento
// (contenido estático de ejemplo, sin acción asociada al pulsarlas).
const cards = [
  {
    title: 'ENTRENAMIENTOS EN CASA',
    desc: 'Ponte en forma en casa con entrenamientos fáciles.',
    color: '#a084e8',
    img: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&w=400&h=120&fit=crop',
  },
  {
    title: 'ENTRENAMIENTOS EN EL GIMNASIO',
    desc: 'Cientos de entrenamientos de fuerza, cardio y cuerpo completo para todos los niveles.',
    color: 'var(--brand-orange)',
    img: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=400&h=120&fit=crop',
  },
  {
    title: 'PROGRAMAS',
    desc: 'Selección de entrenamientos de varias semanas para todos, donde sea que estés.',
    color: '#222',
    img: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&w=400&h=120&fit=crop',
  },
  {
    title: 'BIENESTAR',
    desc: 'Meditaciones, nutrición e inspiración para sentirte bien y feliz.',
    color: '#bba48a',
    img: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&w=400&h=120&fit=crop',
  },
];

// Pantalla de Entrenamiento: punto de entrada para crear una rutina, abrir el
// temporizador de intervalos, o consultar los tipos de entrenamiento disponibles.
// El estado del temporizador (tempoConfig/showTempo) vive en el padre para
// conservar la configuración aunque el usuario salga y vuelva a esta pantalla.
function Entrenamiento({ tempoConfig, setTempoConfig, showTempo, setShowTempo, onCrearRutina }) {
  // Si el temporizador está activo, se muestra a pantalla completa en vez del listado
  if (showTempo) {
    return <Temporizador config={tempoConfig} setConfig={setTempoConfig} onBack={() => setShowTempo(false)} />;
  }

  return (
    <div className="entrenamiento-page">
      <div className="entrenamiento-inner">
        <h2 className="entrenamiento-title">¿CUÁL ES TU ACTITUD PARA ENTRENAR?</h2>
        {/* Accesos rápidos: crear rutina propia o abrir el temporizador de intervalos */}
        <div className="entrenamiento-quick-actions">
          <button
            className="entrenamiento-quick-btn"
            onClick={onCrearRutina}
          >
            <span role="img" aria-label="rutina" className="entrenamiento-quick-icon">🏋️‍♂️</span> CREA TU RUTINA
          </button>
          <button
            className="entrenamiento-quick-btn"
            onClick={() => setShowTempo(true)}
          >
            <span role="img" aria-label="intervalos" className="entrenamiento-quick-icon">⏱️</span> TEMPO. DE INTERVALOS
          </button>
        </div>
        {/* Listado de tarjetas de tipos de entrenamiento (contenido de ejemplo) */}
        {cards.map((card) => (
          <div key={card.title} className="entrenamiento-card" style={{ '--card-color': card.color }}>
            <div className="entrenamiento-card-inner">
              {/* Imagen de fondo semitransparente, superpuesta con el color de la tarjeta */}
              <img src={card.img} alt={card.title} className="entrenamiento-card-img" />
              <div className="entrenamiento-card-content">
                <div className="entrenamiento-card-title">{card.title}</div>
                <div className="entrenamiento-card-desc">{card.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Validación de las props que recibe Entrenamiento
Entrenamiento.propTypes = {
  tempoConfig: PropTypes.shape({ esfuerzo: PropTypes.number, descanso: PropTypes.number, ejercicios: PropTypes.number, rondas: PropTypes.number, reposo: PropTypes.number, sonido: PropTypes.bool }).isRequired,
  setTempoConfig: PropTypes.func.isRequired,
  showTempo: PropTypes.bool,
  setShowTempo: PropTypes.func.isRequired,
  onCrearRutina: PropTypes.func.isRequired,
};

export default Entrenamiento; 