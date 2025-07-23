// Helper para debug temporal - remover después de verificar funcionamiento
export const debugVotaciones = (enabled = true) => {
  if (!enabled) return;
  
  // Esta función nos ayudará a debuggear los datos sin llenar el código de console.log
  return {
    logVotaciones: (votaciones) => console.log('🗳️ Votaciones:', votaciones),
    logVotacion: (votacion, index) => console.log(`📊 Votación ${index}:`, votacion),
    logRespuesta: (response) => console.log('📡 Respuesta backend:', response),
    logError: (error, context) => console.error(`❌ Error en ${context}:`, error)
  };
};

// Helper para extraer texto de opciones de forma segura
export const extraerTextoOpcion = (opcion, index) => {
  if (typeof opcion === 'string') return opcion;
  if (opcion && typeof opcion.texto === 'string') return opcion.texto;
  if (opcion && typeof opcion.nombre === 'string') return opcion.nombre;
  return `Opción ${index + 1}`;
};

// Helper para obtener nombre de votación de forma segura
export const obtenerNombreVotacion = (votacion) => {
  if (!votacion) return 'Sin título';
  
  if (votacion.nombre && typeof votacion.nombre === 'string') {
    return votacion.nombre;
  }
  if (votacion.titulo && typeof votacion.titulo === 'string') {
    return votacion.titulo;
  }
  return 'Sin título';
};

// Helper para formatear fechas de forma segura
export const formatearFechaSafe = (fecha, formato = 'completo') => {
  if (!fecha) return 'No definida';
  
  try {
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return 'Fecha inválida';
    
    const opciones = formato === 'completo' 
      ? {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      : {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        };
    
    return fechaObj.toLocaleString('es-ES', opciones);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error en fecha';
  }
};

// Helper para extraer fecha de votación para filtrado
export const extractDateFromVotacion = (fechaCreacion) => {
  if (!fechaCreacion) return null;
  
  const fecha = new Date(fechaCreacion);
  return fecha.getFullYear() + '-' + 
    String(fecha.getMonth() + 1).padStart(2, '0') + '-' + 
    String(fecha.getDate()).padStart(2, '0');
};

// Helper para filtrar votaciones por fecha
export const filterVotacionesByDate = (votaciones, fechaFiltro) => {
  if (!fechaFiltro) return votaciones;
  
  return votaciones.filter(votacion => {
    const fechaVotacion = extractDateFromVotacion(votacion.inicio);
    return fechaVotacion === fechaFiltro;
  });
};

// Helper para ordenar votaciones por fecha (más reciente primero)
export const sortVotacionesByDate = (votaciones) => {
  return (votaciones || []).sort((a, b) => 
    new Date(b.inicio) - new Date(a.inicio)
  );
};
