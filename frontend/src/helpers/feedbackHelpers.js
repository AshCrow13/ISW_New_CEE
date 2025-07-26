export const extractDateFromFeedback = (fechaCreacion) => {
  if (!fechaCreacion) return null;
  
  const fecha = new Date(fechaCreacion);
  return fecha.getFullYear() + '-' + 
    String(fecha.getMonth() + 1).padStart(2, '0') + '-' + 
    String(fecha.getDate()).padStart(2, '0');
};

export const filterFeedbacksByDate = (feedbacks, fechaFiltro) => {
  if (!fechaFiltro) return feedbacks;
  
  return feedbacks.filter(fb => {
    const fechaFeedback = extractDateFromFeedback(fb.fechaCreacion);
    return fechaFeedback === fechaFiltro;
  });
};

export const isAdmin = (userRole) => {
  return userRole === 'admin' || userRole === 'vocalia';
};
