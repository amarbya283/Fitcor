import React from 'react';
import 'components/css/badge-banner.css';

// Banner de la Home que anuncia la última insignia/logro conseguido por el usuario.
// De momento el contenido es estático (no lee datos reales de progreso).
function BadgeBanner() {
  return (
    <div className="badge-banner">
      <div className="badge-icon">🚀</div>
      <div className="badge-content">
        <div className="badge-title">¡BOOM! ¡HAS GANADO UNA NUEVA INSIGNIA!</div>
        <div className="badge-desc">2 SEMANAS SEGUIDAS<br/>07/07/2025</div>
      </div>
      {/* Icono de compartir la insignia (sin acción asociada todavía) */}
      <div className="badge-share">⇪</div>
    </div>
  );
}

export default BadgeBanner; 