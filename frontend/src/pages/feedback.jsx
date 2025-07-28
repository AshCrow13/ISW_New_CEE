import { useState, useContext, useMemo, useCallback } from 'react';
import useFeedback from '@hooks/feedback/useFeedback.jsx';
import FeedbackForm from "@components/feedbacks/FeedbackForm.jsx";
import FeedbackList from "@components/feedbacks/FeedbackList.jsx";
import FiltroFecha from "@components/feedbacks/FiltroFecha.jsx";
import { AuthContext } from '@context/AuthContext.jsx';
import { deleteFeedback } from '@services/feedback.service.js';
import { filterFeedbacksByDate, isAdmin } from '@helpers/feedbackHelpers.js';
import { Container, Paper, Typography, Box, Button, Grid, IconButton, Fade, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { 
    Feedback as FeedbackIcon,
    ListAlt as ListAltIcon,
    AddComment as AddCommentIcon,
    Close as CloseIcon,
    Add as AddIcon
} from '@mui/icons-material';
import PageContainer from '@components/common/PageContainer';
import PageHeader from '@components/common/PageHeader';

const Feedback = () => {
  const [view, setView] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
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
        alert('Feedback eliminado exitosamente');
        fetchFeedbacks();
      } else {
        alert('Error al eliminar: ' + (resultado.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al eliminar feedback:', error);
      alert(' Error al eliminar el feedback');
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

  const getStatsData = () => {
    return [
      {
        label: 'feedbacks totales',
        value: feedbacks?.length || 0,
        icon: <FeedbackIcon />,
      },
      {
        label: 'este mes',
        value: feedbacksFiltrados?.length || 0,
      },
      {
        label: 'pendientes',
        value: feedbacks?.filter(f => f.estado === 'pendiente')?.length || 0,
      },
    ];
  };

  const handleCrearFeedbackSuccess = () => {
    setModalCrearOpen(false);
    fetchFeedbacks();
  };

  const renderMainContent = () => {
    switch (view) {
      case 'ver':
        return userIsAdmin ? (
          <Fade in={true}>
            <Box>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
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
        ) : null;
      default:
        return (
          <PageHeader
            title="Centro de Feedback"
            subtitle="Comparte tu opinión y mejora tu experiencia estudiantil"
            icon={<FeedbackIcon />}
            breadcrumbs={[
              { label: 'Inicio', href: '/home' },
              { label: 'Feedback' }
            ]}
            stats={getStatsData()}
            actions={[
              {
                label: 'Crear Feedback',
                icon: <AddCommentIcon />,
                props: {
                  variant: 'contained',
                  onClick: () => setModalCrearOpen(true),
                },
              },
              ...(userIsAdmin ? [{
                label: view === 'ver' ? 'Ocultar Feedbacks' : 'Ver Feedbacks',
                icon: <ListAltIcon />,
                props: {
                  variant: view === 'ver' ? 'outlined' : 'contained',
                  color: 'secondary',
                  onClick: handleToggleView,
                },
              }] : [])
            ]}
          />
        );
    }
  };

  return (
    <PageContainer>
      {renderMainContent()}

      {/* Modal de crear feedback */}
      <Dialog
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <FeedbackForm onSuccess={handleCrearFeedbackSuccess} />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Feedback;