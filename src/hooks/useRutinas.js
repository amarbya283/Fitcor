import { useState, useEffect } from 'react';
import { apiFetch } from 'api/base';

// Hook que encapsula la carga inicial de rutinas del backend (GET /api/routines)
// y los estados relacionados. Devuelve setRutinas, setLoading y setError también,
// porque crearrutina.js los sigue necesitando para sus propias mutaciones locales
// (guardar, actualizar, borrar) tras llamadas POST/PUT/DELETE, que comparten
// el mismo indicador de carga y de error que la carga inicial.
export function useRutinas(token) {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRutinas = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await apiFetch('/api/routines', { method: 'GET' }, token);
        const data = await res.json();
        if (res.ok) {
          setRutinas(data);
        } else {
          setError(data.msg || 'Error al cargar rutinas');
        }
      } catch (err) {
        setError('Error de red');
      }
      setLoading(false);
    };
    fetchRutinas();
  }, [token]);

  return { rutinas, setRutinas, loading, setLoading, error, setError };
}
