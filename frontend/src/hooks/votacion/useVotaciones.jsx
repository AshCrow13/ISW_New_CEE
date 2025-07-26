import { useState, useEffect, useCallback } from 'react';
import {
  getVotaciones,
  getVotacionById,
  postVotacion,
  updateVotacion,
  deleteVotacion
} from '@services/votacion.service.js';
import { postVoto } from '@services/votar.service.js';
import { sortVotacionesByDate } from '@helpers/votacionHelpers.js';

const useVotaciones = () => {
  const [view, setView] = useState('tabla'); // 'tabla', 'crear', 'detalle', 'editar'
  const [votaciones, setVotaciones] = useState([]);
  const [votacionSeleccionada, setVotacionSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');

  // Cargar todas las votaciones al inicializar
  const cargarVotaciones = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVotaciones();
      // Ordenar por fecha (más reciente primero)
      const votacionesOrdenadas = sortVotacionesByDate(data || []);
      setVotaciones(votacionesOrdenadas);
    } catch (error) {
      console.error('Error al cargar votaciones:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar votaciones automáticamente al montar el hook
  useEffect(() => {
    cargarVotaciones();
  }, [cargarVotaciones]); // Ahora cargarVotaciones es estable gracias a useCallback

  // Ver detalle de una votación
  const verDetalle = async (id) => {
    setLoading(true);
    try {
      const data = await getVotacionById(id);
      if (data.status === 'Success') {
        setVotacionSeleccionada(data.data);
        setView('detalle');
      } else {
        alert('Votación no encontrada');
      }
    } catch (error) {
      console.error('Error al buscar votación:', error);
      alert('Error al buscar la votación');
    } finally {
      setLoading(false);
    }
  };

  // Ir a la vista de edición
  const irAEditar = async (id) => {
    setLoading(true);
    try {
      const data = await getVotacionById(id);
      if (data.status === 'Success') {
        setVotacionSeleccionada(data.data);
        setView('editar');
      } else {
        alert('Votación no encontrada');
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
        alert('Votación eliminada exitosamente');
        cargarVotaciones(); // Recargar la tabla
      } else {
        alert('Error al eliminar: ' + (resultado.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar votación:', error);
      alert('Error al eliminar la votación');
    }
  };

  // Actualizar una votación
  const handleActualizar = async (id, datosActualizados) => {
    try {
      const resultado = await updateVotacion(id, datosActualizados);
      if (resultado.status === 'Success') {
        alert('Votación actualizada exitosamente');
        setView('tabla');
        cargarVotaciones(); // Recargar la tabla
      } else {
        alert('Error al actualizar: ' + (resultado.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al actualizar votación:', error);
      alert('Error al actualizar la votación');
    }
  };

  // Crear una nueva votación
  const handleCrearVotacion = async (datosVotacion) => {
    try {
      const resultado = await postVotacion(datosVotacion);
      if (resultado.status === 'Success') {
        alert('Votación creada exitosamente');
        setView('tabla');
        cargarVotaciones(); // Recargar la tabla
        return { success: true };
      } else {
        alert('Error al crear la votación: ' + (resultado.message || 'Error desconocido'));
        return { success: false, error: resultado.message };
      }
    } catch (error) {
      alert('Error al crear la votación');
      return { success: false, error: error.message };
    }
  };


  //Votar en una opción de votación
  const handleVotar = async (votacionId, opcionId) => {
    try {
      const resultado = await postVoto({ votacionId , opcionId });
      if (resultado.status === 'Success') {
        alert('Voto registrado exitosamente');
        return { success: true };
      } else {
        alert('Error al votar: ' + (resultado.message || 'Error desconocido'));
        return { success: false, error: resultado.message };
      }
    } catch (error) {
      console.error('Error al votar:', error);
      alert('Error al registrar el voto');
      return { success: false, error: error.message };
    }
  };

  // Volver al menú principal (tabla)
  const volverAlMenu = () => {
    setView('tabla');
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
    verDetalle,
    irAEditar,
    handleEliminar,
    handleActualizar,
    handleCrearVotacion,
    handleVotar,
    volverAlMenu
  };
};

export default useVotaciones;
