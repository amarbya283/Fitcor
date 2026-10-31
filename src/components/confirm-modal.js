import React from 'react';
import PropTypes from 'prop-types';
import 'components/css/confirm-modal.css';

// Modal de confirmación reutilizable: sustituye a window.confirm(), que bloquea el
// navegador y no se puede estilar. Se usa, por ejemplo, antes de borrar una rutina.
// El componente no guarda estado propio: quien lo usa controla isOpen y las acciones.
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'danger' // danger, warning, info
}) {
  // Sin isOpen no se renderiza nada, así el padre solo controla un booleano
  if (!isOpen) return null;

  return (
    // Al pulsar el fondo oscuro se cierra el modal...
    <div className="confirm-overlay" onClick={onClose}>
      {/* ...pero stopPropagation evita que un clic dentro de la caja lo cierre */}
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <h3 className="confirm-title">
          {title}
        </h3>
        <p className="confirm-message">
          {message}
        </p>
        <div className="confirm-actions">
          <button
            onClick={onClose}
            className="confirm-btn-cancel"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`confirm-btn-confirm confirm-btn-confirm--${type}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'info'])
};

export default ConfirmModal;
