import React, { useState, useRef, useEffect } from 'react';
import 'components/css/coach-tips.css';
import entrenadorImg from 'img/entrenador.jpg';
import comidaImg from 'img/comida.jpg';
import gimnasioImg from 'img/gimnasio.jpg';

// Listado estático de consejos del coach que se muestran en el carrusel.
const tips = [
  { title: 'ENTRENA BIEN', img: gimnasioImg, desc: 'Entrena con constancia y escucha a tu cuerpo para evitar lesiones.' },
  { title: 'COME BIEN', img: comidaImg, desc: 'Mantén una alimentación equilibrada y variada para potenciar tus resultados.' },
  { title: 'VIVE BIEN', img: entrenadorImg, desc: 'Descansa, hidrátate y disfruta del proceso. El bienestar es integral.' },
];

// Carrusel de consejos del coach (entrena/come/vive bien), con autoplay y modal de detalle al tocar.
function CoachTips() {
  // consejo seleccionado para mostrar en el modal (null = cerrado)
  const [tipModal, setTipModal] = useState(null);
  // índice del consejo actualmente visible en el carrusel
  const [index, setIndex] = useState(0);
  // referencia al contenedor scrolleable, para desplazarlo por código
  const carruselRef = useRef();
  // referencia al intervalo de autoplay, para poder limpiarlo/reiniciarlo
  const timeoutRef = useRef();

  // Autoplay
  useEffect(() => {
    const next = () => setIndex(i => (i + 1) % tips.length);
    timeoutRef.current = setInterval(next, 5000);
    return () => clearInterval(timeoutRef.current);
  }, []);

  // Scroll al banner activo
  useEffect(() => {
    if (carruselRef.current) {
      carruselRef.current.scrollTo({
        left: carruselRef.current.offsetWidth * index,
        behavior: 'smooth'
      });
    }
  }, [index]);

  // Pausa autoplay al interactuar
  const handleUserScroll = () => {
    clearInterval(timeoutRef.current);
    timeoutRef.current = setInterval(() => setIndex(i => (i + 1) % tips.length), 5000);
  };

  return (
    <div>
      <div className="coach-tips-title">CONSEJOS DEL COACH</div>
      <div
        className="ventajas-carrusel"
        ref={carruselRef}
        onTouchStart={handleUserScroll}
        onWheel={handleUserScroll}
      >
        {tips.map((tip) => (
          <button
            key={tip.title}
            className="ventaja-banner"
            style={{ '--tip-img': `url(${tip.img})` }}
            onClick={() => setTipModal(tip)}
            aria-label={tip.title}
          >
            <div className="ventaja-text">{tip.title}</div>
          </button>
        ))}
      </div>
      {/* Modal de detalle del consejo seleccionado; se muestra solo si hay uno activo */}
      {tipModal && (
        <div className="ventaja-modal-bg" onClick={() => setTipModal(null)}>
          <div className="ventaja-modal" onClick={e => e.stopPropagation()}>
            <img src={tipModal.img} alt={tipModal.title} />
            <div className="ventaja-modal-title">{tipModal.title}</div>
            <div className="ventaja-modal-desc">{tipModal.desc}</div>
            <button className="ventaja-modal-close" onClick={() => setTipModal(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachTips; 