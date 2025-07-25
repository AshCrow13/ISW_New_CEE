import { useState, useContext, useMemo, useCallback } from 'react';
import useFeedback from '@hooks/feedback/useFeedback.jsx';
import FeedbackForm from "@components/FeedbackForm.jsx";
import FeedbackList from "@components/FeedbackList.jsx";
import FiltroFecha from "@components/FiltroFecha.jsx";
import { AuthContext } from '@context/AuthContext.jsx';
import { deleteFeedback } from '@services/feedback.service.js';
import { filterFeedbacksByDate, isAdmin } from '@helpers/feedbackHelpers.js';
import { Container, Paper, Typography, Box, Button, Grid, IconButton, Fade } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CloseIcon from '@mui/icons-material/Close';

const Feedback = () => {
  const [view, setView] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const { feedbacks, loading, fetchFeedbacks } = useFeedback();
  const { user } = useContext(AuthContext);

  // Memorizar feedbacks filtrados 
  const feedbacksFiltrados = useMemo(() => 
    filterFeedbacksByDate(feedbacks, fechaFiltro), 
    [feedbacks, fechaFiltro]
  );

  // Memorizar el rol del usuario
  const userIsAdmin = useMemo(() => isAdmin(user?.rol), [user?.rol]);

  // Eliminar feedbacks
  const handleEliminarFeedback = useCallback(async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este feedback?')) {
      return;
    }
    
    try {
      const resultado = await deleteFeedback(id);
      if (resultado.status === 'Success') {
        alert('✅ Feedback eliminado exitosamente');
        fetchFeedbacks();
      } else {
        alert('❌ Error al eliminar: ' + (resultado.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar feedback:', error);
      alert('❌ Error al eliminar el feedback');
    }
  }, [fetchFeedbacks]);


  const handleFechaChange = useCallback((nuevaFecha) => {
    setFechaFiltro(nuevaFecha);
  }, []);

  const handleClearFilter = useCallback(() => {
    setFechaFiltro('');
  }, []);

  const handleToggleView = useCallback(() => {
    const nuevaVista = view === 'ver' ? null : 'ver';
    setView(nuevaVista);
    if (nuevaVista === 'ver') fetchFeedbacks();
  }, [view, fetchFeedbacks]);

  
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
          {userIsAdmin && (
            <Grid item>
              <Button
                variant={view === 'ver' ? 'outlined' : 'contained'}
                color="secondary"
                startIcon={<ListAltIcon />}
                onClick={handleToggleView}
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

        <Fade in={view === 'ver' && userIsAdmin} unmountOnExit>
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
              
              <FiltroFecha 
                fechaFiltro={fechaFiltro}
                onFechaChange={handleFechaChange}
                onClearFilter={handleClearFilter}
              />

              <FeedbackList
                feedbacks={feedbacksFiltrados}
                loading={loading}
                fechaFiltro={fechaFiltro}
                onDeleteFeedback={handleEliminarFeedback}
                showDeleteButton={userIsAdmin}
              />
            </Paper>
          </Box>
        </Fade>
      </Paper>
    </Container>
  );
};

export default Feedback;