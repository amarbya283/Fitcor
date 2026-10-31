import React from 'react';
import PropTypes from 'prop-types';
import 'components/css/week-visits.css';

// Utilidad para obtener la semana actual (lunes a domingo) según la fecha del sistema
function getCurrentWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=domingo, 1=lunes...
  // Ajuste para que la semana empiece en lunes
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const week = [];
  const labels = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push({
      label: labels[i],
      num: d.getDate(),
      date: d,
      isToday:
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear(),
    });
  }
  return week;
}

// Tira de días de la semana actual en la Home, resaltando el día de hoy.
// "Ver visitas" navega a la pantalla de progreso/visitas (lo controla el padre).
function WeekVisits({ onVerVisitas }) {
  const week = getCurrentWeek();
  return (
    <div className="week-visits">
      <div className="week-title">TU SEMANA <span className="see-visits" onClick={onVerVisitas}>Ver visitas</span></div>
      <div className="days-row">
        {week.map((d, i) => (
          <div
            key={d.num + '-' + d.label}
            // Resalta el círculo del día de hoy
            className={`day-circle${d.isToday ? ' active' : ''}`}
          >
            <div className="day-num">{d.num}</div>
            <div className="day-label">{d.label}</div>
          </div>
        ))}
      </div>
      <div className="set-goal">Fija tu objetivo de visitas <span>★</span></div>
    </div>
  );
}

// Validación de las props que recibe WeekVisits
WeekVisits.propTypes = {
  onVerVisitas: PropTypes.func,
};

export default WeekVisits; 