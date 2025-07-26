import { Paper, Typography, Box } from '@mui/material';
import deleteIcon from '@assets/deleteIcon.svg';

const FeedbackCard = ({ feedback, onDelete, showDeleteButton = false }) => {
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 1, position: 'relative' }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Box display="flex" alignItems="center" gap={1} flex={1}>
          <Typography fontWeight={600} color="primary.main">
            {feedback.usuarioName || 'Anónimo'}
          </Typography>
          {feedback.anonimo && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              (Anónimo)
            </Typography>
          )}
        </Box>
        {showDeleteButton && (
          <Box 
            component="img"
            src={deleteIcon}
            alt="Eliminar feedback"
            onClick={() => onDelete(feedback.id)}
            sx={{ 
              width: 20,
              height: 20,
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'opacity 0.2s',
              '&:hover': { 
                opacity: 1,
                transform: 'scale(1.1)'
              },
              ml: 1
            }}
          />
        )}
      </Box>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {feedback.comentario}
      </Typography>
      {feedback.fechaCreacion && (
        <Typography variant="caption" color="text.disabled">
          Fecha: {formatFecha(feedback.fechaCreacion)}
        </Typography>
      )}
    </Paper>
  );
};

export default FeedbackCard;
