import { useState } from 'react';
import {
  getVotaciones,
  getVotacionById,
  postVotacion,
  updateVotacion,
  deleteVotacion
} from '@services/votacion.service.js';

const useVotaciones = () => {
  const [view, setView] = useState(null); // null, 'crear', 'ver-todas', 'ver-una', 'actualizar', 'borrar'
  const [votaciones, setVotaciones] = useState([]);
  const [votacionSeleccionada, setVotacionSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');

  // Obtener todas las votaciones
  const handleVerTodas = async () => {
    setLoading(true);
    setView('ver-todas');
    try {
      const data = await getVotaciones();
      setVotaciones(data || []);
    } catch (error) {
      console.error('Error al cargar votaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar una votación específica
  const handleVerUna = async () => {
    if (!searchId) {
      alert('Por favor ingresa un ID válido');
      return;
    }
    setLoading(true);
    setView('ver-una');
    try {
      const data = await getVotacionById(searchId);
      if (data.status === 'Success') {
        setVotacionSeleccionada(data.data);
      } else {
        alert('Votación no encontrada');
        setVotacionSeleccionada(null);
      }
    } catch (error) {
      console.error('Error al buscar votación:', error);
      alert('Error al buscar la votación');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una votación
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta votación?')) {
      return;
    }
    try {
      const resultado = await deleteVotacion(id);
      if (resultado.status === 'Success') {
        alert('✅ Votación eliminada exitosamente');
        handleVerTodas();
      } else {
        alert('❌ Error al eliminar: ' + (resultado.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar votación:', error);
      alert('❌ Error al eliminar la votación');
    }
  };

  // Actualizar una votación
  const handleActualizar = async (id, datosActualizados) => {
    try {
      const resultado = await updateVotacion(id, datosActualizados);
      if (resultado.status === 'Success') {
        alert('✅ Votación actualizada exitosamente');
        setView(null);
      } else {
        alert('❌ Error al actualizar: ' + (resultado.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al actualizar votación:', error);
      alert('❌ Error al actualizar la votación');
    }
  };

  // Crear una nueva votación
  const handleCrearVotacion = async (datosVotacion) => {
    try {
      const resultado = await postVotacion(datosVotacion);
      if (resultado.status === 'Success') {
        alert('✅ Votación creada exitosamente');
        setView(null);
        return { success: true };
      } else {
        alert('❌ Error al crear la votación: ' + (resultado.message || 'Error desconocido'));
        return { success: false, error: resultado.message };
      }
    } catch (error) {
      alert('❌ Error al crear la votación');
      return { success: false, error: error.message };
    }
  };

  // Volver al menú principal
  const volverAlMenu = () => {
    setView(null);
    setVotaciones([]);
    setVotacionSeleccionada(null);
    setSearchId('');
  };

  return {
    view,
    setView,
    votaciones,
    setVotaciones,
    votacionSeleccionada,
    setVotacionSeleccionada,
    loading,
    searchId,
    setSearchId,
    handleVerTodas,
    handleVerUna,
    handleEliminar,
    handleActualizar,
    handleCrearVotacion,
    volverAlMenu
  };
};

export default useVotaciones;
