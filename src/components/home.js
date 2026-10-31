import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import PropTypes from 'prop-types';
import BadgeBanner from 'components/badge-banner';
import WeekVisits from 'components/week-visits';
import FeaturedWorkout from 'components/featured-workout';
import CoachTips from 'components/coach-tips';
import BenefitsBanner from 'components/benefits-banner';

// Pantalla principal (Home): agrupa los bloques de la portada (insignias, semana,
// entrenamiento destacado, consejos, acceso QR y ventajas). La navegación entre
// pantallas la controla el componente padre a través de las props onVer*.
const Home = ({ onVerVisitas, onVerTodo, onAvatarClick }) => {
  // Controla si el modal de acceso mediante QR está abierto
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <div className="main-content">
      <BadgeBanner />
      <WeekVisits onVerVisitas={onVerVisitas} />
      <FeaturedWorkout onVerTodo={onVerTodo} />
      <CoachTips />
      
      {/* Banner de acceso tipo SynergyFit, Basic-Fit, etc. */}
      <div className="home-acceso-wrap">
        <button
          className="home-acceso-banner"
          onClick={() => setShowQRModal(true)}
          aria-label="Acceso QR"
        >
          {/* QR pequeño de vista previa dentro del botón de acceso */}
          <QRCodeSVG
            value={'FITCOR-D700244646'}
            size={32}
            bgColor="#7C3AED"
            fgColor="#fff"
            level="H"
            includeMargin={false}
          />
          <span className="home-acceso-banner-label">
            ACCESO
          </span>
        </button>
      </div>

      {/* Modal QR */}
      {showQRModal && (
        <div
          className="home-qr-modal-overlay"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="home-qr-modal-box"
            onClick={e => e.stopPropagation()}
          >
            {/* QR grande a pantalla completa que el torno del gimnasio puede escanear */}
            <QRCodeSVG
              value={'FITCOR-D700244646'}
              size={180}
              bgColor="#ffffff"
              fgColor="#7C3AED"
              level="H"
              includeMargin={false}
              className="home-qr-modal-code"
            />
            <div className="home-qr-modal-title">
              FITCOR
            </div>
            <div className="home-qr-modal-member">
              MemberID: D700244646
            </div>
            <button
              onClick={() => setShowQRModal(false)}
              className="home-qr-modal-close"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      
      <BenefitsBanner />
    </div>
  );
};

Home.propTypes = {
  onVerVisitas: PropTypes.func.isRequired,
  onVerTodo: PropTypes.func.isRequired,
  onAvatarClick: PropTypes.func.isRequired
};

export default Home;