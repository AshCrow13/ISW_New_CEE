
import { useState, useContext } from 'react';
import useFeedback from '@hooks/feedback/useFeedback.jsx';
import FeedbackForm from "@components/FeedbackForm.jsx";
import { AuthContext } from '@context/AuthContext.jsx';
import { deleteFeedback } from '@services/feedback.service.js';
import { Container, Paper, Typography, Box, Button, Grid, CircularProgress, IconButton, Fade, Alert, TextField } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import deleteIcon from '@assets/deleteIcon.svg';

const Feedback = () => {
  const [view, setView] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const { feedbacks, loading, fetchFeedbacks } = useFeedback();
  const { user } = useContext(AuthContext);

  // Filtrar feedbacks por fecha si hay un filtro activo
  const feedbacksFiltrados = fechaFiltro 
    ? feedbacks.filter(fb => {
        if (!fb.fechaCreacion) return false;
        
        // Extraer solo la fecha (sin hora) del feedback
        const fechaFeedback = new Date(fb.fechaCreacion);
        const fechaFeedbackString = fechaFeedback.getFullYear() + '-' + 
          String(fechaFeedback.getMonth() + 1).padStart(2, '0') + '-' + 
          String(fechaFeedback.getDate()).padStart(2, '0');
        
        // Comparar con la fecha seleccionada
        return fechaFeedbackString === fechaFiltro;
      })
    : feedbacks;

  // Función para eliminar feedback
  const handleEliminarFeedback = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este feedback?')) {
      return;
    }
    
    try {
      const resultado = await deleteFeedback(id);
      if (resultado.status === 'Success') {
        alert('✅ Feedback eliminado exitosamente');
        fetchFeedbacks(); // Recargar la lista
      } else {
        alert('❌ Error al eliminar: ' + (resultado.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar feedback:', error);
      alert('❌ Error al eliminar el feedback');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 7 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <FeedbackIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            Feedback del Centro de Estudiantes
          </Typography>
        </Box>
        <Grid container spacing={2} mb={3}>
          <Grid item>
            <Button
              variant={view === 'crear' ? 'outlined' : 'contained'}
              color="primary"
              startIcon={<AddCommentIcon />}
              onClick={() => setView(view === 'crear' ? null : 'crear')}
              sx={{ fontWeight: 700, minWidth: 180 }}
            >
              {view === 'crear' ? 'Ocultar formulario' : 'Crear feedback'}
            </Button>
          </Grid>
          {user?.rol === 'admin' && (
            <Grid item>
              <Button
                variant={view === 'ver' ? 'outlined' : 'contained'}
                color="secondary"
                startIcon={<ListAltIcon />}
                onClick={() => {
                  setView(view === 'ver' ? null : 'ver');
                  if (view !== 'ver') fetchFeedbacks();
                }}
                sx={{ fontWeight: 700, minWidth: 180 }}
              >
                {view === 'ver' ? 'Ocultar feedbacks' : 'Ver feedbacks'}
              </Button>
            </Grid>
          )}
        </Grid>

        <Fade in={view === 'crear'} unmountOnExit>
          <Box>
            <FeedbackForm onSuccess={fetchFeedbacks} />
          </Box>
        </Fade>

        <Fade in={view === 'ver' && user?.rol === 'admin'} unmountOnExit>
          <Box mt={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: '#f8f9fa' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" color="primary" fontWeight={700}>
                  Feedbacks Publicados
                </Typography>
                <IconButton onClick={() => setView(null)} color="error">
                  <CloseIcon />
                </IconButton>
              </Box>
              
              {/* Filtro por fecha */}
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <FilterListIcon color="primary" />
                <TextField
                  type="date"
                  label="Filtrar por fecha"
                  value={fechaFiltro}
                  onChange={(e) => setFechaFiltro(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                  sx={{ minWidth: 200 }}
                />
                {fechaFiltro && (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setFechaFiltro('')}
                  >
                    Limpiar filtro
                  </Button>
                )}
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
                  <CircularProgress color="primary" />
                </Box>
              ) : feedbacksFiltrados.length === 0 ? (
                <Alert severity="info" sx={{ my: 2 }}>
                  {fechaFiltro 
                    ? `No hay feedbacks para la fecha seleccionada (${fechaFiltro.split('-').reverse().join('/')})`
                    : 'No hay feedbacks disponibles'
                  }
                </Alert>
              ) : (
                <Box>
                  {fechaFiltro && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Mostrando {feedbacksFiltrados.length} feedback{feedbacksFiltrados.length !== 1 ? 's ' : ' '} 
                      del {(() => {
                        const [year, month, day] = fechaFiltro.split('-');
                        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                        return `${parseInt(day)} de ${monthNames[parseInt(month) - 1]} de ${year}`;
                      })()}
                    </Typography>
                  )}
                  <Box display="flex" flexDirection="column" gap={2}>
                    {feedbacksFiltrados.map((fb, index) => (
                    <Paper key={fb.id || index} elevation={1} sx={{ p: 2, borderRadius: 2, mb: 1, position: 'relative' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box display="flex" alignItems="center" gap={1} flex={1}>
                          <Typography fontWeight={600} color="primary.main">
                            {fb.usuarioName || 'Anónimo'}
                          </Typography>
                          {fb.anonimo && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              (Anónimo)
                            </Typography>
                          )}
                        </Box>
                        {user?.rol !== 'estudiante' && (
                          <Box 
                            component="img"
                            src={deleteIcon}
                            alt="Eliminar feedback"
                            onClick={() => handleEliminarFeedback(fb.id)}
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
                        {fb.comentario}
                      </Typography>
                      {fb.fechaCreacion && (
                        <Typography variant="caption" color="text.disabled">
                          Fecha: {new Date(fb.fechaCreacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Fade>
      </Paper>
    </Container>
  );
};

export default Feedback;