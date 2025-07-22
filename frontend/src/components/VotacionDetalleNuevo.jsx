import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  HowToVote as HowToVoteIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useVotacionDetalle } from '@hooks/useVotacionDetalle.jsx';

const VotacionDetalleNuevo = ({ votacionSeleccionada, loading, user, onVolver, handleVotar }) => {
  const { conteo, votos, loadingResultados, errorResultados } = useVotacionDetalle({
    votacionSeleccionada,
    loading,
    user,
    handleVotar
  });

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No definida';
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) return 'Fecha inválida';
      
      return fechaObj.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en fecha';
    }
  };

  const obtenerNombreVotacion = (votacion) => {
    if (!votacion) return 'Sin título';
    
    if (votacion.nombre && typeof votacion.nombre === 'string') {
      return votacion.nombre;
    }
    if (votacion.titulo && typeof votacion.titulo === 'string') {
      return votacion.titulo;
    }
    return 'Sin título';
  };

  const obtenerEstadoVotacion = (votacion) => {
    if (!votacion) return { estado: 'Error', color: 'default', icon: <CancelIcon /> };
    
    try {
      const ahora = new Date();
      const inicio = new Date(votacion.inicio);
      const fin = new Date(votacion.fin);
      
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return { estado: 'Datos inválidos', color: 'default', icon: <CancelIcon /> };
      }
      
      if (ahora < inicio) {
        return { estado: 'Programada', color: 'info', icon: <ScheduleIcon /> };
      } else if (ahora >= inicio && ahora <= fin && votacion.estado !== false) {
        return { estado: 'Activa', color: 'success', icon: <CheckCircleIcon /> };
      } else {
        return { estado: 'Cerrada', color: 'error', icon: <CancelIcon /> };
      }
    } catch (error) {
      console.error('Error al determinar estado:', error);
      return { estado: 'Error', color: 'default', icon: <CancelIcon /> };
    }
  };

  const calcularPorcentaje = (votos, total) => {
    if (total === 0) return 0;
    return ((votos / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando detalles de la votación...
        </Typography>
      </Box>
    );
  }

  if (!votacionSeleccionada) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        Votación no encontrada
      </Alert>
    );
  }

  const { estado, color, icon } = obtenerEstadoVotacion(votacionSeleccionada);
  const votacionCerrada = estado === 'Cerrada';
  const totalVotos = conteo && typeof conteo === 'object' ? Object.values(conteo).reduce((sum, count) => sum + count, 0) : 0;

  return (
    <Box>
      {/* Header con botón de volver */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onVolver}
          sx={{ mr: 2 }}
        >
          Volver a la lista
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Detalle de Votación
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información básica */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <HowToVoteIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {obtenerNombreVotacion(votacionSeleccionada)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {icon}
                  <Chip
                    label={estado}
                    color={color}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Información detallada */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Fecha de Inicio
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
                  {formatearFecha(votacionSeleccionada.inicio)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Fecha de Cierre
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4, mb: 2 }}>
                  {formatearFecha(votacionSeleccionada.fin)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScheduleIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Duración
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {votacionSeleccionada.duracion || 'No definida'} {votacionSeleccionada.duracion ? 'minutos' : ''}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    ID de Votación
                  </Typography>
                </Box>
                <Typography variant="body1">
                  #{votacionSeleccionada.id || 'No disponible'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Estadísticas */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Estadísticas
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total de votos registrados
            </Typography>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
              {totalVotos}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Opciones disponibles
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {Array.isArray(votacionSeleccionada.opciones) ? votacionSeleccionada.opciones.length : 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Opciones de votación */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Opciones de Votación
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {votacionSeleccionada.opciones && Array.isArray(votacionSeleccionada.opciones) && votacionSeleccionada.opciones.length > 0 ? (
              <List>
                {votacionSeleccionada.opciones.map((opcion, index) => {
                  const votosOpcion = conteo ? (conteo[opcion.id] || 0) : 0;
                  const porcentaje = calcularPorcentaje(votosOpcion, totalVotos);
                  
                  // Obtener texto de la opción de forma segura
                  const textoOpcion = (() => {
                    if (typeof opcion === 'string') return opcion;
                    if (opcion && typeof opcion.texto === 'string') return opcion.texto;
                    if (opcion && typeof opcion.nombre === 'string') return opcion.nombre;
                    return `Opción ${index + 1}`;
                  })();
                  
                  return (
                    <ListItem 
                      key={opcion.id || index}
                      sx={{ 
                        mb: 1, 
                        bgcolor: 'background.default', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <ListItemIcon>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          borderRadius: '50%', 
                          width: 32, 
                          height: 32, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontWeight: 600
                        }}>
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {textoOpcion}
                          </Typography>
                        }
                        secondary={
                          votacionCerrada && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {votosOpcion} votos ({porcentaje}%)
                              </Typography>
                              <Box sx={{ 
                                width: '100%', 
                                height: 8, 
                                bgcolor: 'grey.300', 
                                borderRadius: 1, 
                                mt: 1,
                                overflow: 'hidden'
                              }}>
                                <Box sx={{ 
                                  width: `${porcentaje}%`, 
                                  height: '100%', 
                                  bgcolor: 'primary.main',
                                  transition: 'width 0.3s ease'
                                }} />
                              </Box>
                            </Box>
                          )
                        }
                      />
                      {estado === 'Activa' && handleVotar && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleVotar(votacionSeleccionada.id, opcion.id)}
                          sx={{ ml: 2, fontWeight: 600, borderRadius: 2 }}
                        >
                          Votar
                        </Button>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Alert severity="info">
                No hay opciones de votación definidas
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Mensaje informativo para votaciones activas */}
        {estado === 'Activa' && (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Esta votación está activa
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Los resultados se mostrarán una vez que la votación termine el{' '}
                <strong>{formatearFecha(votacionSeleccionada.fin)}</strong>
              </Typography>
            </Alert>
          </Grid>
        )}

        {/* Resultados - solo para votaciones cerradas */}
        {votacionCerrada && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Resultados Finales
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {loadingResultados ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Cargando resultados...</Typography>
                </Box>
              ) : errorResultados ? (
                <Alert severity="error">{errorResultados}</Alert>
              ) : totalVotos === 0 ? (
                <Alert severity="info">
                  Esta votación no tiene votos registrados
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                      📊 Resumen de Votación
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Total de votos emitidos:</strong> {totalVotos}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Opciones disponibles:</strong> {Array.isArray(votacionSeleccionada.opciones) ? votacionSeleccionada.opciones.length : 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Participación:</strong> {votos && Array.isArray(votos) ? votos.length : 0} usuarios votaron
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default VotacionDetalleNuevo;
