import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import FeedbackCard from './FeedbackCard.jsx';

const FeedbackList = ({ 
  feedbacks, 
  loading, 
  fechaFiltro, 
  onDeleteFeedback, 
  showDeleteButton = false 
}) => {

  const formatearFecha = (fechaString) => {
    const [year, month, day] = fechaString.split('-');
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${parseInt(day)} de ${monthNames[parseInt(month) - 1]} de ${year}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        {fechaFiltro 
          ? `No hay feedbacks para la fecha seleccionada (${fechaFiltro.split('-').reverse().join('/')})`
          : 'No hay feedbacks disponibles'
        }
      </Alert>
    );
  }

  return (
    <Box>
      {fechaFiltro && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Mostrando {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''} 
          del {formatearFecha(fechaFiltro)}
        </Typography>
      )}
      <Box display="flex" flexDirection="column" gap={2}>
        {feedbacks.map((fb, index) => (
          <FeedbackCard
            key={fb.id || index}
            feedback={fb}
            onDelete={onDeleteFeedback}
            showDeleteButton={showDeleteButton}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FeedbackList;
