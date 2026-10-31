import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'paginas/css/temporizador.css';

// Rellena con un cero a la izquierda los números menores de 10 (para mostrar "0:07" en vez de "0:7")
function pad(n) {
  return n < 10 ? '0' + n : n;
}

// Anillo de progreso circular reutilizable: dibuja un círculo de fondo (pista completa)
// y otro por encima cuyo trazo se va "vaciando" según percent (1 = lleno, 0 = vacío),
// usado para mostrar visualmente cuánto queda de la fase actual (esfuerzo/descanso/reposo).
function CircularProgress({ percent, color = 'var(--brand-orange)', size = 220, stroke = 14 }) {
  // radio del círculo, descontando el grosor del trazo
  const r = (size - stroke) / 2;
  // longitud total de la circunferencia (perímetro)
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      {/* Pista de fondo, siempre completa */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#444"
        strokeWidth={stroke}
        fill="none"
      />
      {/* Trazo de progreso: strokeDasharray/strokeDashoffset simulan el "vaciado" del círculo */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - percent)}
        strokeLinecap="round"
        className="temporizador-ring-progress"
      />
    </svg>
  );
}

// Temporizador de intervalos (tipo HIIT): alterna fases de esfuerzo/descanso por cada
// ejercicio, y una fase de reposo más larga al completar todos los ejercicios de una ronda.
// config (esfuerzo, descanso, reposo, ejercicios, rondas, sonido) vive en el padre para
// que la configuración se conserve aunque el usuario salga y vuelva a esta pantalla.
function Temporizador({ config, setConfig, onBack }) {
  // Estados agrupados por finalidad:
  // - edicion: campo de config que se edita en el modal ('esfuerzo', 'rondas'...; null = modal
  //   cerrado) y su valor temporal antes de confirmarlo con "HECHO"
  // - estado: si se ve la pantalla de cuenta atrás y si está corriendo o en pausa
  // - sesion: punto del entrenamiento. fase: 'esfuerzo' | 'descanso' | 'reposo' | 'fin';
  //   segundos restantes de la fase, ejercicio actual (1..config.ejercicios) y ronda (1..config.rondas)
  const [edicion, setEdicion] = useState({ campo: null, valor: 0 });
  const [estado, setEstado] = useState({ visible: false, enMarcha: false });
  const [sesion, setSesion] = useState({ fase: 'esfuerzo', segundos: config.esfuerzo, ejercicio: 1, ronda: 1 });
  const { campo: editKey, valor: editValue } = edicion;
  const { visible: showTimer, enMarcha: running } = estado;
  const { fase, segundos, ejercicio, ronda } = sesion;
  const timerRef = useRef();

  // Motor de la cuenta atrás: cada segundo resta 1 a "segundos", o pasa a la siguiente
  // fase con handleNext() cuando llega a 0. Se detiene si el temporizador no está visible,
  // está en pausa, o ya se llegó a la fase 'fin'.
  useEffect(() => {
    if (!showTimer) return;
    if (!running) return;
    if (fase === 'fin') return;
    timerRef.current = setTimeout(() => {
      if (segundos > 1) {
        setSesion(prev => ({ ...prev, segundos: prev.segundos - 1 }));
      } else {
        handleNext();
      }
    }, 1000);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line
  }, [showTimer, running, segundos, fase]);

  // Avanza a la siguiente fase del entrenamiento: de esfuerzo pasa a descanso (si quedan
  // ejercicios) o a reposo/fin (si se acabó la ronda); de descanso vuelve a esfuerzo con
  // el siguiente ejercicio; de reposo vuelve a esfuerzo reiniciando ejercicios en la ronda siguiente.
  const handleNext = () => {
    if (fase === 'esfuerzo') {
      if (ejercicio < config.ejercicios) {
        setSesion(prev => ({ ...prev, fase: 'descanso', segundos: config.descanso }));
      } else {
        if (ronda < config.rondas) {
          setSesion(prev => ({ ...prev, fase: 'reposo', segundos: config.reposo }));
        } else {
          setSesion(prev => ({ ...prev, fase: 'fin' }));
        }
      }
    } else if (fase === 'descanso') {
      setSesion(prev => ({ ...prev, fase: 'esfuerzo', ejercicio: prev.ejercicio + 1, segundos: config.esfuerzo }));
    } else if (fase === 'reposo') {
      setSesion(prev => ({ ...prev, fase: 'esfuerzo', ejercicio: 1, ronda: prev.ronda + 1, segundos: config.esfuerzo }));
    }
  };

  // Inicia el entrenamiento desde cero: muestra la pantalla de cuenta atrás y
  // reinicia fase, segundos, ejercicio y ronda a sus valores iniciales.
  const handleStart = () => {
    setEstado({ visible: true, enMarcha: true });
    setSesion({ fase: 'esfuerzo', segundos: config.esfuerzo, ejercicio: 1, ronda: 1 });
  };

  const handlePause = () => setEstado(prev => ({ ...prev, enMarcha: false }));
  const handleResume = () => setEstado(prev => ({ ...prev, enMarcha: true }));
  // Sale del temporizador y vuelve a la pantalla de configuración, sin perder el config actual
  const handleSalir = () => {
    setEstado({ visible: false, enMarcha: false });
  };

  // --- Pantalla de temporizador funcional ---
  if (showTimer) {
    // Pantalla final al completar todas las rondas configuradas
    if (fase === 'fin') {
      return (
        <div className="temporizador-fin">
          <div className="temporizador-fin-titulo">¡Entrenamiento finalizado!</div>
          <button onClick={handleSalir} className="temporizador-fin-salir">Salir</button>
        </div>
      );
    }
    // Duración total de la fase actual y fracción restante, usados para el anillo de progreso
    const totalFase = fase === 'esfuerzo' ? config.esfuerzo : fase === 'descanso' ? config.descanso : config.reposo;
    const percent = segundos / totalFase;
    return (
      <div className="temporizador-page">
        <div className="temporizador-content">
          <div className="temporizador-header">
            <button onClick={handleSalir} className="temporizador-close-btn">×</button>
            <span className="temporizador-header-time">{`0:${pad(segundos)}`}</span>
            <span className="temporizador-header-square">▢</span>
          </div>
          {/* Contadores de ejercicio y ronda actuales frente al total configurado */}
          <div className="temporizador-contadores">
            <div className="temporizador-contador">
              <div className="temporizador-contador-valor">{ejercicio}/{config.ejercicios}</div>
              <div className="temporizador-contador-label">EJERCICIOS</div>
            </div>
            <div className="temporizador-contador">
              <div className="temporizador-contador-valor">{ronda}/{config.rondas}</div>
              <div className="temporizador-contador-label">RONDAS</div>
            </div>
          </div>
          {/* Anillo de progreso con el nombre de la fase y el tiempo restante superpuestos en el centro */}
          <div className="temporizador-ring-wrap">
            <div className="temporizador-ring-inner">
              <CircularProgress percent={percent} color={fase === 'esfuerzo' ? 'var(--brand-orange)' : 'var(--accent-teal)'} />
              <div className="temporizador-ring-overlay">
                <div className={`temporizador-fase-label ${fase === 'esfuerzo' ? 'temporizador-fase-label--esfuerzo' : 'temporizador-fase-label--descanso'}`}>{fase.toUpperCase()}</div>
                <div className="temporizador-ring-tiempo">{`00:${pad(segundos)}`}</div>
              </div>
            </div>
          </div>
          <div className="temporizador-controles">
            {running ? (
              <button onClick={handlePause} className="temporizador-pausa-btn">❚❚</button>
            ) : (
              <button onClick={handleResume} className="temporizador-play-btn">▶️</button>
            )}
            <button onClick={handleNext} className="temporizador-siguiente-btn">⏭️</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Pantalla de configuración (por defecto) ---
  // Calcula la duración total estimada del entrenamiento a partir de la config actual:
  // (esfuerzo + descanso) por cada ejercicio y ronda, más el reposo entre rondas.
  const totalTime = () => {
    // Tiempo total estimado (simple)
    const { esfuerzo, descanso, ejercicios, rondas, reposo } = config;
    const tiempo = ((esfuerzo + descanso) * ejercicios * rondas + reposo * (rondas - 1));
    const min = Math.floor(tiempo / 60);
    const sec = tiempo % 60;
    return `${pad(min)}:${pad(sec)}`;
  };

  // Abre el modal de edición para el campo de config indicado, precargando su valor actual
  const handleEdit = (key, value) => {
    setEdicion({ campo: key, valor: value });
  };

  // Confirma el valor editado en el modal y lo guarda en config (elevado al padre)
  const handleSave = () => {
    setConfig({ ...config, [editKey]: Number(editValue) });
    setEdicion(prev => ({ ...prev, campo: null }));
  };

  return (
    <div className="temporizador-page">
      <div className="temporizador-content">
        <div className="temporizador-header temporizador-header--config">
          <button onClick={onBack} className="temporizador-back-btn">&larr;</button>
          <span className="temporizador-header-titulo">TEMPORIZADOR DE INTERVALOS</span>
        </div>
        <div className="temporizador-previsto">
          <div className="temporizador-previsto-valor">{totalTime()}</div>
          <div className="temporizador-previsto-label">TIEMPO PREVISTO</div>
        </div>
        {/* Tarjetas de configuración: cada una muestra un valor de config y un botón ✏️ para editarlo */}
        <div className="temporizador-cards">
          <div className="temporizador-card">
            <div className="temporizador-card-titulo">
              <span className="temporizador-card-icono temporizador-card-icono--orange">▶️</span>
              <span className="temporizador-card-label">ESFUERZO</span>
            </div>
            <div className="temporizador-card-valor temporizador-card-valor--orange">{`00:${pad(config.esfuerzo)}`}</div>
            <button className="temporizador-edit-btn" onClick={() => handleEdit('esfuerzo', config.esfuerzo)}>✏️</button>
          </div>
          <div className="temporizador-card">
            <div className="temporizador-card-titulo">
              <span className="temporizador-card-icono temporizador-card-icono--teal">⏳</span>
              <span className="temporizador-card-label">DESCANSO</span>
            </div>
            <div className="temporizador-card-valor temporizador-card-valor--teal">{`00:${pad(config.descanso)}`}</div>
            <button className="temporizador-edit-btn" onClick={() => handleEdit('descanso', config.descanso)}>✏️</button>
          </div>
          <div className="temporizador-card">
            <div className="temporizador-card-titulo">
              <span className="temporizador-card-icono temporizador-card-icono--blanco">🏋️‍♂️</span>
              <span className="temporizador-card-label">EJERCICIOS</span>
            </div>
            <div className="temporizador-card-valor temporizador-card-valor--blanco">{config.ejercicios}</div>
            <button className="temporizador-edit-btn" onClick={() => handleEdit('ejercicios', config.ejercicios)}>✏️</button>
          </div>
          <div className="temporizador-card">
            <div className="temporizador-card-titulo">
              <span className="temporizador-card-icono temporizador-card-icono--blanco">🔁</span>
              <span className="temporizador-card-label">RONDAS</span>
            </div>
            <div className="temporizador-card-valor temporizador-card-valor--blanco">{config.rondas}</div>
            <button className="temporizador-edit-btn" onClick={() => handleEdit('rondas', config.rondas)}>✏️</button>
          </div>
          <div className="temporizador-card">
            <div className="temporizador-card-titulo">
              <span className="temporizador-card-icono temporizador-card-icono--teal">⏲️</span>
              <span className="temporizador-card-label">REPOSO</span>
            </div>
            <div className="temporizador-card-valor temporizador-card-valor--teal">{`0${Math.floor(config.reposo/60)}:${pad(config.reposo%60)}`}</div>
            <button className="temporizador-edit-btn" onClick={() => handleEdit('reposo', config.reposo)}>✏️</button>
          </div>
          <div className="temporizador-card">
            <div className="temporizador-card-titulo">
              <span className="temporizador-card-icono temporizador-card-icono--blanco">🔊</span>
              <span className="temporizador-card-label">SONIDO</span>
            </div>
            {/* Interruptor de sonido, con checkbox real oculto y un toggle dibujado a mano con spans */}
            <div className="temporizador-sonido-wrap">
              <label className="temporizador-sonido-label">
                <input type="checkbox" checked={config.sonido} onChange={e => setConfig({ ...config, sonido: e.target.checked })} className="temporizador-sonido-checkbox" />
                <span className={`temporizador-toggle ${config.sonido ? 'temporizador-toggle--activo' : ''}`}>
                  <span className={`temporizador-toggle-knob ${config.sonido ? 'temporizador-toggle-knob--activo' : ''}`}></span>
                </span>
              </label>
            </div>
          </div>
        </div>
        <button onClick={handleStart} className="temporizador-comenzar-btn">
          COMENZAR
        </button>
      </div>
      {/* Modal inferior para editar un valor de config; solo visible si editKey no es null */}
      {editKey && (
        <div className="temporizador-modal-overlay">
          <div className="temporizador-modal">
            <div className="temporizador-modal-titulo">Editar valor</div>
            <input
              type="number"
              value={editValue}
              onChange={e => setEdicion(prev => ({ ...prev, valor: e.target.value }))}
              className="temporizador-modal-input"
              min={0}
            />
            <div>
              <button onClick={handleSave} className="temporizador-modal-hecho-btn">HECHO</button>
              <button onClick={() => setEdicion(prev => ({ ...prev, campo: null }))} className="temporizador-modal-cancelar-btn">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Validación de las props que recibe CircularProgress
CircularProgress.propTypes = {
  percent: PropTypes.number.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  stroke: PropTypes.number,
};

// Validación de las props que recibe Temporizador
Temporizador.propTypes = {
  config: PropTypes.shape({ esfuerzo: PropTypes.number, descanso: PropTypes.number, ejercicios: PropTypes.number, rondas: PropTypes.number, reposo: PropTypes.number, sonido: PropTypes.bool }).isRequired,
  setConfig: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Temporizador; 