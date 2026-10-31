import React from 'react';
import PropTypes from 'prop-types';
import 'components/css/featured-workout.css';
import gimnasioImg from 'img/gimnasiomaquinas.jpg';

// Banner destacado de un entrenamiento en la Home; "Ver todo" lo controla el padre (onVerTodo).
function FeaturedWorkout({ onVerTodo }) {
  return (
    <div className="featured-workout">
      <div className="fw-title">
        POTENCIA TU VERANO{' '}
        <span className="fw-see-all" onClick={onVerTodo}>Ver todo</span>
      </div>
      {/* Imagen del entrenamiento destacado con su descripción superpuesta */}
      <div className="fw-banner">
        <img src={gimnasioImg} alt="Gimnasio" className="fw-img" />
        <div className="fw-desc">
          7 MIN - ABS & CORE CRUNCH TIME<br/>
          <span className="fw-details">7 min • Todos los niveles • Equipamiento ligero • Video-entrenamiento</span>
        </div>
      </div>
    </div>
  );
}

// Validación de las props que recibe FeaturedWorkout
FeaturedWorkout.propTypes = {
  onVerTodo: PropTypes.func,
};

export default FeaturedWorkout; 