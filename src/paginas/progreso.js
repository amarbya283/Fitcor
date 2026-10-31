import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProgresoVisitas from 'paginas/progreso-visitas';
import ProgresoEntrenamientos from 'paginas/progreso-entrenamientos';
import ProgresoDatos from 'paginas/progreso-datos';
import ProgresoInsignias from 'paginas/progreso-insignias';

// Pantalla de Progreso: actúa como contenedor de pestañas y delega el renderizado
// de cada sección (Mis datos, Entrenamientos, Visitas, Insignias) al subcomponente
// correspondiente, pasándole la pestaña activa y la función para cambiarla.
function Progreso({ onGotoEntrenamiento }) {
  // Pestaña actualmente seleccionada dentro de Progreso
  const [tab, setTab] = useState('Mis datos');

  // Selecciona qué subcomponente mostrar según la pestaña activa
  let contenido = null;
  if (tab === 'Visitas') {
    contenido = <ProgresoVisitas activeTab={tab} onTabChange={setTab} />;
  } else if (tab === 'Entrenamientos') {
    contenido = <ProgresoEntrenamientos activeTab={tab} onTabChange={setTab} onVerEntrenamientos={onGotoEntrenamiento} />;
  } else if (tab === 'Mis datos') {
    contenido = <ProgresoDatos activeTab={tab} onTabChange={setTab} />;
  } else if (tab === 'Insignias') {
    contenido = <ProgresoInsignias activeTab={tab} onTabChange={setTab} />;
  }

  return (
    <div className="progreso-responsive">
      {contenido}
    </div>
  );
}

// Validación de las props que recibe Progreso
Progreso.propTypes = {
  onGotoEntrenamiento: PropTypes.func,
};

export default Progreso; 