import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import 'components/css/user-profile.css';

// Pantalla de perfil: foto, datos de socio y accesos a suscripción y pagos.
// La foto se guarda en el componente padre (props foto/setFoto) para que siga
// visible en la cabecera al cambiar de pantalla.
function Perfil({ onBack, foto, setFoto, onLogout }) {
  // El input de archivo está oculto por CSS: el usuario pulsa el avatar y esta
  // referencia permite abrirlo sin mostrar el input por defecto del navegador
  const fileInput = useRef();
  // showModal: si la ventana está abierta · modalTipo: qué muestra ('subscripcion' o 'pagos')
  const [showModal, setShowModal] = useState(false);
  const [modalTipo, setModalTipo] = useState('subscripcion');
  // Los pagos antiguos empiezan ocultos para no alargar la lista
  const [mostrarPagosAnteriores, setMostrarPagosAnteriores] = useState(false);

  // Pulsar el avatar equivale a pulsar el input de archivo oculto
  const handleFotoClick = () => {
    fileInput.current.click();
  };

  // Convierte la imagen elegida en data URL con FileReader y la guarda en el estado
  // del padre, así se ve al instante sin subirla a ningún servidor
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cierra el modal solo si el click cae en el fondo, no en su contenido
  const handleModalBgClick = (e) => {
    if (e.target.className === 'modal-bg') setShowModal(false);
  };

  return (
    <div className="user-profile">
      {/* Cabecera: volver, avatar editable con la foto y datos del socio */}
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span className="back-text">Volver</span>
        </button>
        <div className="profile-avatar profile-avatar-clickable" onClick={handleFotoClick}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
          {foto ? (
            <img src={foto} alt="Foto de perfil" className="profile-avatar-photo" />
          ) : (
            <span className="profile-avatar-icon">👤</span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            className="profile-file-input-hidden"
            onChange={handleFotoChange}
          />
          <span className="profile-edit-badge">✏️</span>
        </div>
        <div className="profile-name"> MARÍA</div>
        <div className="profile-id">MemberID: 70024*****
        </div>
        <div className="profile-type">Comfort Member</div>
      </div>
      {/* Accesos del perfil y cierre de sesión */}
      <div className="profile-options">
        <div className="profile-option" onClick={() => { setShowModal(true); setModalTipo('subscripcion'); }}>
          Suscripción y extras
          <span className="profile-option-icon">↗</span>
        </div>
        <div className="profile-option" onClick={() => { setShowModal(true); setModalTipo('pagos'); }}>
          Pagos
          <span className="profile-option-icon">↗</span>
        </div>
        <div className="profile-option">
          Mis datos personales
          <span className="profile-option-icon">↗</span>
        </div>
        <div className="profile-option">
          Personaliza tu información de fitness
          <span className="profile-option-icon">↗</span>
        </div>
        <button onClick={typeof onLogout === 'function' ? onLogout : undefined} className="profile-logout-btn">
          Cerrar sesión
        </button>
      </div>

      {showModal && (
        <div className="modal-bg" onClick={handleModalBgClick}>
          <div className="modal-content">
            <button onClick={() => setShowModal(false)} className="profile-modal-close-btn">Cerrar</button>
            {/* Contenido del modal según la opción elegida: condiciones del contrato,
                extras contratables y preguntas frecuentes */}
            {modalTipo === 'subscripcion' && (
              <div className="profile-modal-section">
                <h2 className="profile-modal-title">INSCRIPCIÓN</h2>
                <div className="profile-contract-box">
                  <div className="profile-section-title profile-section-title-tight">INFORMACIÓN DEL CONTRATO</div>
                  <div className="profile-modal-text">
                    Tu suscripción se ampliará automáticamente cada <b>4 semanas</b>.<br />
                    Recuerda que puedes cancelar en cualquier momento con <b>4 semanas</b>.
                  </div>
                  <div className="profile-info-row profile-info-row--medium"><span className="profile-info-label">Próximo pago</span> <span className="profile-info-value">17-07-2025</span></div>
                </div>
                <div className="profile-section-title">DETALLES DE AFILIACIÓN</div>
                <div className="profile-info-row"><span className="profile-info-label">Inscripción</span> <span className="profile-info-value">COMFORT</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Duración mínima</span> <span className="profile-info-value">4 semanas</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Fecha de inicio</span> <span className="profile-info-value">30-1-2025</span></div>
                <div className="profile-info-row"><span className="profile-info-label">Cuota</span> <span className="profile-info-value">24,99 € por 4 semanas</span></div>
                <div className="profile-info-row profile-info-row--spaced"><span className="profile-info-label">Número de socio</span> <span className="profile-info-value">D700244646</span></div>
                <div className="profile-divider"></div>
                <div className="profile-section-title">CONTRATO DE ADHESIÓN</div>
                <div className="profile-modal-text-block">
                  Actualmente, la opción de descargar el contrato de afiliación no está disponible en la aplicación. Por favor, vaya al navegador de su teléfono para descargar su contrato de afiliación.
                </div>
                <div className="profile-section-title">INSCRIPCIÓN ACTUAL</div>
                <div className="profile-btn-group">
                  <button className="profile-action-btn">
                    <span className="profile-btn-label">
                      <span role="img" aria-label="cambiar">🔄</span> Cambiar inscripción
                    </span>
                    <span className="profile-btn-chevron">{'>'}</span>
                  </button>
                  <button className="profile-action-btn profile-action-btn--danger">
                    <span className="profile-btn-label">
                      <span role="img" aria-label="baja">❌</span> Darme de baja
                    </span>
                    <span className="profile-btn-chevron">{'>'}</span>
                  </button>
                </div>
                {/* Extras que el socio puede contratar aparte de la cuota */}
                <div className="profile-section-title">MIS AÑADIDOS</div>
                <div className="profile-addon-card profile-addon-card--orange">
                  <div className="profile-addon-title">BOLSA DE GIMNASIO</div>
                  <div className="profile-addon-desc">Recibirás un mensaje cuando tu bolsa de deporte esté disponible en tu club.</div>
                  <div className="profile-addon-price">0,00 € <span className="profile-addon-price-unit">/ una vez</span></div>
                  <button className="profile-addon-btn">SOLICITAR</button>
                </div>
                <div className="profile-addon-card profile-addon-card--teal">
                  <div className="profile-addon-title">YANGA SPORTS WATER</div>
                  <div className="profile-addon-desc">Mejora tu hidratación y tus entrenamientos con YANGA Sports Water. Elige tu sabor favorito de entre los 6 disponibles. Son súper refrescantes.</div>
                  <div className="profile-addon-price profile-addon-price--neutral">4,99 € <span className="profile-addon-price-unit">/ 4 semanas</span></div>
                  <div className="profile-addon-toggle-row">
                    <span>Activar</span>
                    <input type="checkbox" className="profile-checkbox-lg" />
                  </div>
                </div>
                <div className="profile-section-title">PREGUNTAS FRECUENTES</div>
                <div className="profile-faq-intro"><b>¿Tienes alguna pregunta? Estamos a tu disposición.</b></div>
                <div className="profile-faq-question">¿Cuál es la duración mínima de una tarifa?</div>
                <div className="profile-faq-question">¿Deseo cambiar de tarifa. ¿Cómo hacerlo?</div>
              </div>
            )}
            {/* Historial de pagos: próximos cargos y transacciones completadas */}
            {modalTipo === 'pagos' && (
              <div className="profile-modal-section">
                {/* Cabecera naranja */}
                <div className="profile-payments-header">
                  <div className="profile-payments-title">PAGOS</div>
                  <div className="profile-payments-desc">
                    Aquí encontrarás una vista previa de todas tus transacciones abiertas y completadas. Gym-fit pretende ser transparente siempre, por lo que de esta manera sabrás exactamente en qué situación de pago te encuentras. ¿Tienes alguna duda respecto a los pagos? Revisa la página FAQ para una respuesta rápida.
                  </div>
                </div>
                {/* Débitos futuros */}
                <div className="profile-payments-card profile-payments-card--debits">
                  <div className="profile-card-title">DÉBITOS FUTUROS</div>
                  <div className="profile-debit-row">
                    <span>Cuota De Membresía</span>
                    <span className="profile-text-orange">-24,99 €</span>
                  </div>
                  <div className="profile-debit-sub">Comfort 17-07 / 13-08 <span className="profile-info-value">24,99 €</span></div>
                  <div className="profile-debit-note">Próximo periodo <b>Jueves 17-07</b></div>
                  <div className="profile-debit-link">
                    Débitos futuros <span className="profile-btn-chevron">→</span>
                  </div>
                </div>
                {/* Resumen de transacciones */}
                <div className="profile-payments-card profile-payments-card--summary">
                  <div className="profile-summary-icon-wrap">
                    <span className="profile-summary-icon">
                      <svg width="44" height="44" viewBox="0 0 44 44"><g><rect width="44" height="44" rx="12" fill="#fff7e6"/><path d="M13 24l6 6 12-12" stroke="var(--brand-orange)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 14c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5v2.5" stroke="var(--accent-teal)" strokeWidth="2.5" fill="none"/></g></svg>
                    </span>
                    <div className="profile-summary-status">¡Sí! TODO VA BIEN</div>
                  </div>
                  <div className="profile-summary-header-row">
                    <div className="profile-flex-2">Descripción</div>
                    <div className="profile-flex-1-right">Transacciones</div>
                  </div>
                  {/* Fila 1 */}
                  <div className="profile-transaction-row">
                    <div className="profile-flex-2">
                      <div className="profile-transaction-desc">Cuota de la Suscripción 19-06-2025/16-07-2025</div>
                      <div className="profile-transaction-date">19-06-2025</div>
                    </div>
                    <div className="profile-flex-1-right">
                      <div className="profile-transaction-amount">-24,99 €</div>
                      <div className="profile-transaction-link">Ver Factura</div>
                    </div>
                  </div>
                  {/* Fila 2 */}
                  <div className="profile-transaction-row">
                    <div className="profile-flex-2">
                      <div className="profile-transaction-desc">Period: 19-06-2025 / 16-07-2025 (SEPA)</div>
                      <div className="profile-transaction-date">18-06-2025</div>
                    </div>
                    <div className="profile-flex-1-right">
                      <div className="profile-transaction-badge">24,99 €</div>
                    </div>
                  </div>
                  {/* Fila 3 */}
                  <div className="profile-transaction-row">
                    <div className="profile-flex-2">
                      <div className="profile-transaction-desc">Cuota de la Suscripción 22-05-2025/18-06-2025</div>
                      <div className="profile-transaction-date">22-05-2025</div>
                    </div>
                    <div className="profile-flex-1-right">
                      <div className="profile-transaction-amount">-24,99 €</div>
                      <div className="profile-transaction-link">Ver Factura</div>
                    </div>
                  </div>
                  {/* Fila 4 */}
                  <div className="profile-transaction-row">
                    <div className="profile-flex-2">
                      <div className="profile-transaction-desc">Period: 22-05-2025 / 18-06-2025 (SEPA)</div>
                      <div className="profile-transaction-date">21-05-2025</div>
                    </div>
                    <div className="profile-flex-1-right">
                      <div className="profile-transaction-badge">24,99 €</div>
                    </div>
                  </div>
                  {/* Mostrar pagos anteriores */}
                  {!mostrarPagosAnteriores && (
                    <div className="profile-show-more-row" onClick={() => setMostrarPagosAnteriores(true)}>
                      <span className="profile-show-more-text">
                        MOSTRAR PAGOS<br/>ANTERIORES
                      </span>
                      <span className="profile-show-more-arrow">&rarr;</span>
                    </div>
                  )}
                  {mostrarPagosAnteriores && (
                    <>
                      {/* Más filas de ejemplo */}
                      <div className="profile-transaction-row">
                        <div className="profile-flex-2">
                          <div className="profile-transaction-desc">Cuota de la Suscripción 20-04-2025/18-05-2025</div>
                          <div className="profile-transaction-date">20-04-2025</div>
                        </div>
                        <div className="profile-flex-1-right">
                          <div className="profile-transaction-amount">-24,99 €</div>
                          <div className="profile-transaction-link">Ver Factura</div>
                        </div>
                      </div>
                      <div className="profile-transaction-row">
                        <div className="profile-flex-2">
                          <div className="profile-transaction-desc">Period: 20-04-2025 / 18-05-2025 (SEPA)</div>
                          <div className="profile-transaction-date">19-04-2025</div>
                        </div>
                        <div className="profile-flex-1-right">
                          <div className="profile-transaction-badge">24,99 €</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* Advertencia */}
                <div className="profile-notice-box">
                  <span className="profile-notice-icon">ⓘ</span>
                  <div className="profile-notice-text">
                    Se necesita un DNI válido (o NIE para residentes extranjeros) para generar facturas válidas.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Validación de las props que recibe Perfil
Perfil.propTypes = {
  onBack: PropTypes.func.isRequired,
  foto: PropTypes.string,
  setFoto: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Perfil;