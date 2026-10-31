import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { apiFetch } from 'api/base';
import 'components/css/user-profile.css';
import 'paginas/css/crear-rutina.css';
import ConfirmModal from 'components/confirm-modal';
import { ejerciciosEjemplo, instrucciones } from 'data/ejercicios';
import { useRutinas } from 'hooks/useRutinas';

// Formulario vacío de crear/editar rutina (editandoId null = se está creando una nueva)
const FORM_VACIO = { nombre: '', ejercicios: [], editandoId: null };

// Los tres componentes siguientes se definen fuera de Rutinas a propósito. Definidos
// dentro, React los tomaría por un componente distinto en cada render del padre: los
// desmontaría y los volvería a montar, perdiendo su estado interno. Eso hacía que, al
// llegar la respuesta de GET /api/routines, se borrasen los ejercicios ya marcados.

// Ficha de un ejercicio: imagen, instrucciones y, si se pasa onAdd, botón para añadirlo
function DetalleEjercicio({ ejercicio, onClose, onAdd }) {
  return (
    <div className="rutinas-modal-overlay rutinas-modal-overlay--ejercicio">
      <div className="rutinas-modal-ejercicio">
        <button onClick={onClose} className="rutinas-modal-close-left" aria-label="Volver">
          <span className="rutinas-arrow-icon">←</span>
        </button>
        <img src={ejercicio.imagen} alt={ejercicio.nombre} className="rutinas-modal-img" />
        <div className="rutinas-modal-body">
          <div className="rutinas-divider" />
          <h3 className="rutinas-modal-title">{ejercicio.nombre}</h3>
          <div className="rutinas-dots">
            <span className="rutinas-dot-activo" />
            <span className="rutinas-dot-inactivo" />
          </div>
          <div className="rutinas-section-label">INSTRUCCIONES</div>
          {/* Si el ejercicio no trae instrucciones propias se usa un texto genérico */}
          <ol className="rutinas-lista-instrucciones">
            {(instrucciones[ejercicio.nombre] || ejercicio.instrucciones || ['Ejecuta el ejercicio con buena técnica.']).map((ins) => (
              <li key={ins} className="rutinas-instruccion-item">{ins}</li>
            ))}
          </ol>
          {onAdd && (
            <button
              onClick={() => { onAdd([ejercicio.nombre]); onClose(); }}
              className="rutinas-btn-añadir-detalle"
            >
              Añadir ejercicio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Validación de las props que recibe DetalleEjercicio
DetalleEjercicio.propTypes = {
  ejercicio: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    imagen: PropTypes.string,
    instrucciones: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func,
};

// Pantalla de búsqueda y selección de ejercicios. Mantiene su propio estado y solo
// avisa al padre (onAdd) con la lista final cuando se confirma.
function AñadirEjercicios({ onBack, onAdd }) {
  // Estado agrupado: texto de búsqueda, ejercicios marcados y ejercicio abierto en detalle
  const [pantalla, setPantalla] = useState({ busqueda: '', seleccionados: [], detalle: null });
  const { busqueda, seleccionados, detalle } = pantalla;
  const setDetalle = (ej) => setPantalla(prev => ({ ...prev, detalle: ej }));
  const ejerciciosFiltrados = ejerciciosEjemplo.filter(ej =>
    ej.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Marca o desmarca un ejercicio sin perder el resto de la selección
  const toggleSeleccion = (nombre) => {
    setPantalla(prev => ({
      ...prev,
      seleccionados: prev.seleccionados.includes(nombre)
        ? prev.seleccionados.filter(e => e !== nombre)
        : [...prev.seleccionados, nombre]
    }));
  };

  return (
    <div className="rutinas-page rutinas-page--con-boton-fijo">
      <div className="rutinas-header-row">
        <button onClick={onBack} className="rutinas-back-btn">←</button>
        <h2 className="rutinas-titulo-seccion">Añadir ejercicios</h2>
      </div>
      <input
        type="text"
        value={busqueda}
        onChange={e => setPantalla(prev => ({ ...prev, busqueda: e.target.value }))}
        placeholder="Buscar ejercicios"
        className="rutinas-input-busqueda"
      />
      <div className="rutinas-ordenar-por">Ordenar por</div>
      <div>
        {ejerciciosFiltrados.map((ej) => (
          // Pulsar la fila abre la ficha; el botón de la derecha solo marca o desmarca,
          // por eso detiene la propagación del click
          <div key={ej.nombre} onClick={() => setDetalle(ej)} className="rutinas-ejercicio-row">
            <img src={ej.imagen} alt={ej.nombre} className="rutinas-ejercicio-img" />
            <div className="rutinas-ejercicio-info">
              <div className="rutinas-ejercicio-nombre">{ej.nombre}</div>
              <div className="rutinas-ejercicio-meta">{ej.grupo} · {ej.descripcion}</div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); toggleSeleccion(ej.nombre); }}
              className="rutinas-btn-check"
            >
              {seleccionados.includes(ej.nombre) ? '✔️' : '+'}
            </button>
          </div>
        ))}
        {/* Espaciador para scroll extra */}
        <div className="rutinas-spacer" />
      </div>
      <button
        onClick={() => onAdd(seleccionados)}
        disabled={seleccionados.length === 0}
        className="rutinas-btn-añadir"
      >
        Añadir ejercicios
      </button>
      {detalle && <DetalleEjercicio ejercicio={detalle} onClose={() => setDetalle(null)} onAdd={nombres => { onAdd(nombres); setDetalle(null); }} />}
    </div>
  );
}

// Validación de las props que recibe AñadirEjercicios
AñadirEjercicios.propTypes = {
  onBack: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

// Modal con el contenido de una rutina guardada. Acepta tanto el formato del backend
// (name/exercises) como el que se usa en los datos de ejemplo (nombre/ejercicios).
function DetalleRutina({ rutina, onClose, onVerEjercicio }) {
  const listaEjercicios = Array.isArray(rutina.exercises)
    ? rutina.exercises
    : (Array.isArray(rutina.ejercicios) ? rutina.ejercicios : []);

  return (
    <div className="rutinas-modal-overlay">
      <div className="rutinas-modal-rutina">
        <button onClick={onClose} className="rutinas-modal-close-right">✕</button>
        <h3 className="rutinas-modal-rutina-titulo">{rutina.name || rutina.nombre}</h3>
        <div className="rutinas-modal-rutina-count">{listaEjercicios.length} ejercicios</div>
        <ul className="rutinas-lista-ejercicios">
          {listaEjercicios.map((ej) => {
            const nombreEj = ej.name || ej;
            return (
              <li key={nombreEj} className="rutinas-ejercicio-item"
                onClick={() => {
                  // Se busca la ficha completa del ejercicio; si no está en los datos de
                  // ejemplo, se muestra al menos su nombre
                  const datosEjemplo = ejerciciosEjemplo.find(e => e.nombre.toLowerCase() === nombreEj.toLowerCase());
                  onVerEjercicio(datosEjemplo ? datosEjemplo : { nombre: nombreEj });
                }}
              >
                {nombreEj}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// Validación de las props que recibe DetalleRutina
DetalleRutina.propTypes = {
  rutina: PropTypes.shape({
    name: PropTypes.string,
    nombre: PropTypes.string,
    exercises: PropTypes.array,
    ejercicios: PropTypes.array,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onVerEjercicio: PropTypes.func.isRequired,
};

// Pantalla de rutinas: crea, lista, edita y borra las plantillas del usuario contra la API
function Rutinas({ onBack, token }) {
  // Estados agrupados por finalidad:
  // - form: datos de la rutina que se está creando o editando
  // - vista: pestaña activa y si se muestra la pantalla de añadir ejercicios
  // - modales: qué ventana está abierta y con qué datos
  const [form, setForm] = useState(FORM_VACIO);
  const [vista, setVista] = useState({ tab: 'crear', mostrarAñadir: false });
  const [modales, setModales] = useState({
    rutinaSeleccionada: null,
    detalleEjercicio: null,
    confirmarBorrado: false,
    rutinaABorrar: null,
  });
  // Rutinas: carga inicial (GET /api/routines) + estados asociados, extraído a un hook
  const { rutinas, setRutinas, loading, setLoading, error, setError } = useRutinas(token);
  const { nombre, ejercicios, editandoId } = form;
  const { tab, mostrarAñadir } = vista;

  // Cambia de pestaña conservando el resto del estado de la vista
  const cambiarTab = (nuevaTab) => setVista(prev => ({ ...prev, tab: nuevaTab }));
  const mostrarPantallaAñadir = (mostrar) => setVista(prev => ({ ...prev, mostrarAñadir: mostrar }));

  // Guardar rutina en el backend
  const handleGuardar = async () => {
    if (!nombre || ejercicios.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: nombre,
        description: 'Rutina personalizada',
        exercises: ejercicios.map(e => ({
          name: e,
          sets: 3,
          reps: 12
        }))
      };
      const res = await apiFetch('/api/routines', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, token);
      const data = await res.json();
      if (res.ok) {
        setRutinas(prev => [...prev, data]);
        setForm(FORM_VACIO);
        cambiarTab('mis');
      } else {
        setError(data.msg || 'Error al guardar rutina');
      }
    } catch (err) {
      setError('Error de red');
    }
    setLoading(false);
  };

  // Empezar a editar una rutina: rellena el formulario con sus datos y abre el tab de crear
  const handleEmpezarEdicion = (rutina) => {
    setForm({ nombre: rutina.name, ejercicios: rutina.exercises.map(ej => ej.name), editandoId: rutina._id });
    cambiarTab('crear');
  };

  // Actualizar rutina existente en el backend (PUT)
  const handleActualizar = async () => {
    if (!nombre || ejercicios.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: nombre,
        description: 'Rutina personalizada',
        exercises: ejercicios.map(e => ({
          name: e,
          sets: 3,
          reps: 12
        }))
      };
      const res = await apiFetch('/api/routines/' + editandoId, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }, token);
      const data = await res.json();
      if (res.ok) {
        setRutinas(prev => prev.map(r => r._id === editandoId ? data : r));
        setForm(FORM_VACIO);
        cambiarTab('mis');
      } else {
        setError(data.msg || 'Error al actualizar rutina');
      }
    } catch (err) {
      setError('Error de red');
    }
    setLoading(false);
  };

  // Cancelar la edición y volver al modo crear nueva
  const handleCancelarEdicion = () => {
    setForm(FORM_VACIO);
  };

  // Borrar rutina: primero se pide confirmación en el modal
  const handleBorrar = (id) => {
    setModales(prev => ({ ...prev, confirmarBorrado: true, rutinaABorrar: id }));
  };

  // Borra en el backend la rutina marcada y la quita de la lista local
  const confirmarBorrar = async () => {
    const id = modales.rutinaABorrar;
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/routines/${id}`, {
      method: 'DELETE'
    }, token);
      if (res.ok) {
        setRutinas(prev => prev.filter(r => r._id !== id));
        setModales(prev => ({ ...prev, rutinaSeleccionada: null }));
      } else {
        const data = await res.json();
        setError(data.msg || 'Error al borrar rutina');
      }
    } catch (err) {
      setError('Error de red');
    }
    setLoading(false);
    setModales(prev => ({ ...prev, rutinaABorrar: null }));
  };

  // Añadir ejercicios (sin duplicar los que ya estaban en la rutina)
  const handleAñadirEjercicios = (seleccionados) => {
    setForm(prev => ({
      ...prev,
      ejercicios: [...prev.ejercicios, ...seleccionados.filter(e => !prev.ejercicios.includes(e))]
    }));
    mostrarPantallaAñadir(false);
  };

  // Permite quitar un ejercicio sin modificar los demás datos del formulario.
  const handleQuitarEjercicio = (nombreEjercicio) => {
  setForm(prev => ({
    ...prev,
    ejercicios: prev.ejercicios.filter(
      e => e !== nombreEjercicio
    )
   }));
  };

  // --- UI PRINCIPAL ---
  // La pantalla de añadir ejercicios sustituye a la vista completa mientras está abierta
  if (mostrarAñadir) {
    return <AñadirEjercicios onBack={() => mostrarPantallaAñadir(false)} onAdd={handleAñadirEjercicios} />;
  }

  return (
    <div className="rutinas-page">
      <div className="rutinas-header-row">
        <button onClick={onBack} className="rutinas-back-btn">←</button>
        <h2 className="rutinas-titulo-pagina">Rutinas</h2>
      </div>
      {/* Tabs */}
      <div className="rutinas-tabs">
        <div
          onClick={() => cambiarTab('crear')}
          className={`rutinas-tab ${tab === 'crear' ? 'rutinas-tab-activa' : ''}`}
        >
          Crear plantilla
        </div>
        <div
          onClick={() => cambiarTab('mis')}
          className={`rutinas-tab ${tab === 'mis' ? 'rutinas-tab-activa' : ''}`}
        >
          Mis plantillas
        </div>
      </div>
      {/* Contenido de cada tab */}
      {tab === 'crear' && (
        <>
          {editandoId && (
            <div className="rutinas-editando-label">Editando: {nombre}</div>
          )}
          <div className="rutinas-form-group">
            <label className="rutinas-label">Nombre de la rutina</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Core, Full Body..."
              className="rutinas-input"
            />
          </div>
          <div className="rutinas-form-group">
            <label className="rutinas-label">Ejercicios</label>
            {ejercicios.length === 0 && <div className="rutinas-vacio">Aún no has añadido ejercicios</div>}
            {ejercicios.map((ej) => (
            <div key={ej} className="rutinas-ejercicio-agregado">
            <span>{ej}</span>

            <button
            type="button"
            className="rutinas-btn-quitar-ejercicio"
            onClick={() => handleQuitarEjercicio(ej)}
            aria-label={`Quitar ${ej}`}
            >
            ✕
            </button>
            </div>
            ))}
            <button onClick={() => mostrarPantallaAñadir(true)} className="rutinas-btn-secundario">+ Añadir ejercicios</button>
          </div>
          {/* El mismo botón guarda o actualiza según se esté editando una rutina o creando una nueva */}
          <button
            onClick={editandoId ? handleActualizar : handleGuardar}
            disabled={!nombre || ejercicios.length === 0}
            className="rutinas-btn-guardar"
          >
            {editandoId ? 'Guardar cambios' : 'Guardar rutina'}
          </button>
          {editandoId && (
            <button
              onClick={handleCancelarEdicion}
              className="rutinas-btn-cancelar"
            >
              Cancelar edición
            </button>
          )}
        </>
      )}
      {tab === 'mis' && (
        <div className="rutinas-mis-plantillas">
          {loading && <div className="rutinas-loading">Cargando rutinas...</div>}
          {error && <div className="rutinas-error">{error}</div>}
          {rutinas.length === 0 && !loading && !error && <div className="rutinas-vacio-plantillas">Aún no tienes plantillas guardadas</div>}
          {rutinas.map((r) => (
            // Pulsar la tarjeta abre el detalle; editar y borrar detienen la propagación
            <div key={r._id} onClick={() => setModales(prev => ({ ...prev, rutinaSeleccionada: r }))} className="rutinas-card">
              <div className="rutinas-card-nombre">{r.name}</div>
              <div className="rutinas-card-meta">{r.exercises.length} ejercicios</div>
              <button
                onClick={e => { e.stopPropagation(); handleEmpezarEdicion(r); }}
                className="rutinas-btn-editar"
              >
                ✎ Editar
              </button>
              <button
                onClick={e => { e.stopPropagation(); handleBorrar(r._id); }}
                className="rutinas-btn-borrar"
              >
                ✕
              </button>
            </div>
          ))}
          {modales.rutinaSeleccionada && (
            <DetalleRutina
              rutina={modales.rutinaSeleccionada}
              onClose={() => setModales(prev => ({ ...prev, rutinaSeleccionada: null }))}
              onVerEjercicio={(ej) => setModales(prev => ({ ...prev, detalleEjercicio: ej }))}
            />
          )}
          {modales.detalleEjercicio && (
            <DetalleEjercicio
              ejercicio={modales.detalleEjercicio}
              onClose={() => setModales(prev => ({ ...prev, detalleEjercicio: null }))}
            />
          )}
          {/* Espaciador para scroll extra */}
          <div className="rutinas-spacer" />
        </div>
      )}

      <ConfirmModal
        isOpen={modales.confirmarBorrado}
        onClose={() => setModales(prev => ({ ...prev, confirmarBorrado: false, rutinaABorrar: null }))}
        onConfirm={confirmarBorrar}
        title="Eliminar rutina"
        message="¿Seguro que quieres borrar esta rutina? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}

// Validación de las props que recibe Rutinas
Rutinas.propTypes = {
  onBack: PropTypes.func.isRequired,
  token: PropTypes.string,
};

export default Rutinas;
