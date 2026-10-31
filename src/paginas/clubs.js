import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'paginas/css/clubs.css';

// Pantalla de clubes: carrusel de gimnasios favoritos, mapa para añadir más,
// gráfica de afluencia y listado de servicios. El mapa usa react-leaflet con las
// teselas gratuitas de OpenStreetMap, que no necesitan clave de API.

// Clubes que el usuario ya tiene como favoritos al abrir la pantalla
const clubsEjemplo = [
  {
    nombre: 'Calle Serramagna',
    ciudad: 'Burgos',
    imagen: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&w=400&h=120&fit=crop',
  },
  {
    nombre: 'Gym Center Madrid',
    ciudad: 'Madrid',
    imagen: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=400&h=120&fit=crop',
  },
  {
    nombre: 'FitZone Barcelona',
    ciudad: 'Barcelona',
    imagen: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&w=400&h=120&fit=crop',
  },
];

// Gimnasios que se dibujan como marcadores en el mapa, con sus coordenadas
const gimnasiosMapa = [
  { nombre: 'FITCOR SEGOVIA AVENIDA DEL OBISPO QUESADA', lat: 40.9481, lng: -4.1184, calle: 'Av. del Obispo Quesada, 12' },
  { nombre: 'FITCOR BURGOS CALLE SERRAMAGNA', lat: 42.3439, lng: -3.6969, calle: 'C. Serramagna, 8' },
  { nombre: 'FITCOR BURGOS CALLE DE LA PLAZA', lat: 42.3435, lng: -3.7010, calle: 'C. de la Plaza, 3' },
  { nombre: 'FITCOR A CORUÑA AVENIDA DE CASTELAO', lat: 43.3623, lng: -8.4115, calle: 'Av. de Castelao, 22' },
  { nombre: 'FITCOR Madrid', lat: 40.4168, lng: -3.7038, calle: 'C. de Alcalá, 45' },
  { nombre: 'FITCOR Barcelona', lat: 41.3874, lng: 2.1686, calle: 'C. de Balmes, 101' },
  { nombre: 'FITCOR Sevilla', lat: 37.3886, lng: -5.9823, calle: 'Av. de la Constitución, 18' },
  { nombre: 'FITCOR Valencia', lat: 39.4699, lng: -0.3763, calle: 'C. de Colón, 7' },
  { nombre: 'FITCOR Bilbao', lat: 43.263, lng: -2.935, calle: 'C. Gran Vía, 56' },
  { nombre: 'FITCOR París', lat: 48.8566, lng: 2.3522, calle: 'Rue de Rivoli, 120' },
  { nombre: 'FITCOR Berlín', lat: 52.52, lng: 13.405, calle: 'Friedrichstraße, 200' },
  { nombre: 'FITCOR Roma', lat: 41.9028, lng: 12.4964, calle: 'Via del Corso, 80' },
  { nombre: 'FITCOR Londres', lat: 51.5074, lng: -0.1278, calle: 'Oxford St, 300' },
  { nombre: 'FITCOR Lisboa', lat: 38.7223, lng: -9.1393, calle: 'Av. da Liberdade, 150' },
  { nombre: 'FITCOR Ámsterdam', lat: 52.3676, lng: 4.9041, calle: 'Damrak, 50' },
  { nombre: 'FITCOR Bruselas', lat: 50.8503, lng: 4.3517, calle: 'Rue Neuve, 22' },
  { nombre: 'FITCOR Praga', lat: 50.0755, lng: 14.4378, calle: 'Václavské náměstí, 10' },
  { nombre: 'FITCOR Viena', lat: 48.2082, lng: 16.3738, calle: 'Mariahilfer Str., 99' },
  { nombre: 'FITCOR Varsovia', lat: 52.2297, lng: 21.0122, calle: 'ul. Marszałkowska, 120' },
  { nombre: 'FITCOR Estocolmo', lat: 59.3293, lng: 18.0686, calle: 'Drottninggatan, 80' },
  { nombre: 'FITCOR Copenhague', lat: 55.6761, lng: 12.5683, calle: 'Strøget, 40' },
  { nombre: 'FITCOR Dublín', lat: 53.3498, lng: -6.2603, calle: 'O’Connell St, 15' },
  { nombre: 'FITCOR Múnich', lat: 48.1351, lng: 11.582, calle: 'Leopoldstraße, 60' },
  { nombre: 'FITCOR Milán', lat: 45.4642, lng: 9.19, calle: 'Corso Buenos Aires, 200' },
  { nombre: 'FITCOR Oporto', lat: 41.1579, lng: -8.6291, calle: 'Rua de Santa Catarina, 300' },
  { nombre: 'FITCOR Atenas', lat: 37.9838, lng: 23.7275, calle: 'Ermou, 45' },
  { nombre: 'FITCOR Budapest', lat: 47.4979, lng: 19.0402, calle: 'Andrássy út, 70' },
  { nombre: 'FITCOR Zurich', lat: 47.3769, lng: 8.5417, calle: 'Bahnhofstrasse, 88' },
  { nombre: 'FITCOR Oslo', lat: 59.9139, lng: 10.7522, calle: 'Karl Johans gate, 20' },
  { nombre: 'FITCOR Helsinki', lat: 60.1699, lng: 24.9384, calle: 'Aleksanterinkatu, 12' },
  { nombre: 'FITCOR Nueva York', lat: 40.7128, lng: -74.006, calle: '5th Ave, 500' },
  { nombre: 'FITCOR Los Ángeles', lat: 34.0522, lng: -118.2437, calle: 'Sunset Blvd, 300' },
  { nombre: 'FITCOR Miami', lat: 25.7617, lng: -80.1918, calle: 'Collins Ave, 100' },
  { nombre: 'FITCOR Chicago', lat: 41.8781, lng: -87.6298, calle: 'N Michigan Ave, 400' },
  { nombre: 'FITCOR Tokio', lat: 35.6895, lng: 139.6917, calle: 'Shibuya, 1-1' },
  { nombre: 'FITCOR Osaka', lat: 34.6937, lng: 135.5023, calle: 'Dotonbori, 2-2' },
  { nombre: 'FITCOR Sapporo', lat: 43.0618, lng: 141.3545, calle: 'Odori, 3-3' },
  { nombre: 'FITCOR Nagoya', lat: 35.1815, lng: 136.9066, calle: 'Sakae, 4-4' },
  { nombre: 'FITCOR Zaragoza', lat: 41.6488, lng: -0.8891, calle: 'Paseo Independencia, 10' },
  { nombre: 'FITCOR Málaga', lat: 36.7213, lng: -4.4214, calle: 'Calle Larios, 5' },
];

// Icono propio de los marcadores: al empaquetar el proyecto, Leaflet no encuentra
// la ruta de su icono por defecto, así que se define uno a mano
const icon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Leaflet calcula mal el tamaño del mapa cuando este se monta dentro de un contenedor
// que aún se está abriendo, y queda gris a medias. invalidateSize() lo recalcula una vez
// terminada la animación de apertura.
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    // Limpieza: si el componente se desmonta antes de esos 200 ms (el usuario cierra
    // el mapa enseguida), se cancela el temporizador para no tocar un mapa ya destruido
    return () => clearTimeout(id);
  }, [map]);
  return null;
}

function Clubs() {
  // clubs: lista de favoritos del carrusel · showMap: si el modal del mapa está abierto
  const [clubs, setClubs] = React.useState(clubsEjemplo);
  const [showMap, setShowMap] = React.useState(false);

  // Añade a favoritos un gimnasio elegido en el mapa, comprobando antes que no
  // esté ya en la lista para no duplicarlo
  const handleAgregarFavorito = (gim) => {
    if (!clubs.some(c => c.nombre === gim.nombre)) {
      setClubs([{ nombre: gim.nombre, ciudad: '', imagen: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&w=400&h=120&fit=crop' }, ...clubs]);
    }
  };

  return (
    <div className="clubs-page">
      {/* Clubes favoritos */}
      <div className="clubs-header">
        <div className="clubs-header-title">MIS CLUBES FAVORITOS</div>
        <div className="clubs-carousel">
          {clubs.map((club) => (
            <div key={club.nombre} className="clubs-card">
              <img src={club.imagen} alt={club.nombre} className="clubs-card-img" />
              <div className="clubs-card-badge">Gimnasio de</div>
              <div className="clubs-card-name">{club.nombre}</div>
              <div className="clubs-card-city">{club.ciudad}</div>
            </div>
          ))}
          {/* Card para agregar */}
          <div className="clubs-add-card"
            onClick={() => setShowMap(true)}
          >
            <div className="clubs-add-icon">+</div>
            <div className="clubs-add-label">Agregar gimnasio</div>
          </div>
        </div>
      </div>
      {/* Modal del mapa */}
      {showMap && (
        <div className="clubs-modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowMap(false); }}
        >
          <div className="clubs-modal-box">
            <button onClick={() => setShowMap(false)} className="clubs-modal-close">✕</button>
            <div className="clubs-map-wrapper">
              {/* scrollWheelZoom desactivado: dentro de un modal, el zoom con la rueda
                  impediría hacer scroll en la página */}
              <MapContainer center={[40.4168, -3.7038]} zoom={3} className="clubs-map-container" scrollWheelZoom={false}>
                <ResizeMap />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {gimnasiosMapa.map((g) => (
                  <Marker key={g.nombre} position={[g.lat, g.lng]} icon={icon}>
                    <Popup>
                      <div className="clubs-popup-title">{g.nombre}</div>
                      <div className="clubs-popup-calle">{g.calle}</div>
                      <button onClick={() => handleAgregarFavorito(g)} className="clubs-popup-btn">
                        Agregar a favoritos
                      </button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
      {/* Gráfica de horas populares (estática) */}
      <div className="clubs-hours">
        <div className="clubs-hours-title">Calle Serramagna – Horas más populares del club</div>
        {/* Gráfica de afluencia hecha con divs: la altura de cada barra se pasa por una
            variable CSS y el viernes (i === 4) se resalta como día punta */}
        <div className="clubs-bars">
          {/* Datos inventados de afluencia por día (lunes a domingo) */}
          {[
            { dia: 'lu', valor: 30 },
            { dia: 'ma', valor: 40 },
            { dia: 'mi', valor: 35 },
            { dia: 'ju', valor: 60 },
            { dia: 'vi', valor: 80 },
            { dia: 'sá', valor: 65 },
            { dia: 'do', valor: 25 },
          ].map((d, i) => (
            <div key={d.dia} className="clubs-bar-col">
              <div
                className={`clubs-bar${i === 4 ? ' clubs-bar--destacada' : ''}`}
                style={{ '--bar-height': `${d.valor}px` }}
              ></div>
              <div className={`clubs-bar-label${i === 4 ? ' clubs-bar-label--destacada' : ''}`}>{d.dia}</div>
            </div>
          ))}
        </div>
        <div className="clubs-hours-note">● Hora basada en predicciones</div>
      </div>
      {/* Servicios en el gimnasio */}
      <div className="clubs-services">
        <div className="clubs-section-title">SERVICIOS EN EL GIMNASIO</div>
        <div className="clubs-list">
          <div className="clubs-list-item">
            <span className="clubs-list-icon">📅</span> Horario de clases colectivas <span className="clubs-list-spacer" /> <span className="clubs-list-arrow">→</span>
          </div>
          <div className="clubs-list-item">
            <span className="clubs-list-icon">👁️‍🗨️</span> Encuentra entrenador personal <span className="clubs-list-spacer" /> <span className="clubs-list-arrow">→</span>
          </div>
          <div className="clubs-list-item clubs-list-item--last">
            <span className="clubs-list-icon">➕</span> Encuentra fisioterapeuta <span className="clubs-list-spacer" /> <span className="clubs-list-arrow">→</span>
          </div>
        </div>
        <div className="clubs-section-title clubs-section-title--spaced">INSTALACIONES Y SOPORTE</div>
        <div className="clubs-list">
          <div className="clubs-list-item">
            <span className="clubs-list-icon">💬</span> Chat y ayuda <span className="clubs-list-spacer" /> <span className="clubs-list-arrow">↗</span>
          </div>
          <div className="clubs-list-item clubs-list-item--last">
            <span className="clubs-list-icon">🏢</span> Instalaciones del club <span className="clubs-list-spacer" /> <span className="clubs-list-arrow">↗</span>
          </div>
        </div>
      </div>
      {/* Botón buscar gimnasio */}
      <div className="clubs-search-wrapper">
        <button className="clubs-search-btn"
          onClick={() => setShowMap(true)}
        >
          <span className="clubs-search-icon">📍</span> BUSCAR UN GIMNASIO
        </button>
      </div>
      <div className="clubs-bottom-spacer" />
    </div>
  );
}

export default Clubs; 