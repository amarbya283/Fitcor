import React from 'react';
import PropTypes from 'prop-types';
import 'components/css/avatar-button.css';

// Botón redondo de la cabecera que abre la pantalla de perfil (onClick lo controla el padre).
// Muestra la foto de perfil si existe, o un icono genérico si el usuario no ha subido ninguna.
function AvatarButton({ onClick, foto }) {
  return (
    <button className="avatar-btn" onClick={onClick}>
      {foto ? (
        // Foto de perfil ya guardada (base64 desde UserProfile)
        <img src={foto} alt="Foto de perfil" />
      ) : (
        // Sin foto: icono por defecto
        <span className="avatar-icon">👤</span>
      )}
    </button>
  );
}

// Validación de las props que recibe AvatarButton
AvatarButton.propTypes = {
  onClick: PropTypes.func,
  foto: PropTypes.string,
};

export default AvatarButton; 