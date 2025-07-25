import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const VotacionEditar = ({ votacion, onVolver, onGuardar, loading }) => {
  const [duracion, setDuracion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (votacion) {
      setDuracion(votacion.duracion?.toString() || '');
    }
  }, [votacion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!duracion || duracion.trim() === '') {
      setError('La duración es requerida');
      return;
    }

    const duracionNum = parseInt(duracion);
    if (isNaN(duracionNum) || duracionNum <= 0) {
      setError('La duración debe ser un número mayor a 0');
      return;
    }

    if (duracionNum > 10080) { // Máximo una semana en minutos
      setError('La duración no puede ser mayor a 10080 minutos (1 semana)');
      return;
    }

    // Llamar al handler de guardar
    onGuardar(votacion.id, { duracion: duracionNum });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No definida';
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularNuevaFechaFin = () => {
    if (!votacion?.inicio || !duracion) return 'No se puede calcular';
    
    const duracionNum = parseInt(duracion);
    if (isNaN(duracionNum)) return 'Duración inválida';
    
    const inicio = new Date(votacion.inicio);
    const fin = new Date(inicio.getTime() + duracionNum * 60000); // minutos a milisegundos
    
    return formatearFecha(fin);
  };

  if (!votacion) {
    return (
      <Alert severity="error">
        No se pudo cargar la información de la votación
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onVolver}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Editar Votación
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información de la votación */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Información de la Votación
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {votacion.titulo || votacion.nombre || 'Sin título'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ID
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                #{votacion.id}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Fecha de Inicio
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatearFecha(votacion.inicio)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Fecha de Fin Actual
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatearFecha(votacion.fin)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Duración Actual
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {votacion.duracion} minutos
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Formulario de edición */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Modificar Duración
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label="Nueva Duración"
                  type="number"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScheduleIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        minutos
                      </InputAdornment>
                    ),
                  }}
                  helperText="Ingrese la nueva duración en minutos (máximo 10080 minutos = 1 semana)"
                  error={!!error}
                  disabled={loading}
                />
              </FormControl>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {duracion && !error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Nueva fecha de fin calculada:</strong><br />
                    {calcularNuevaFechaFin()}
                  </Typography>
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading || !duracion}
                  sx={{ flex: 1, borderRadius: 2, fontWeight: 600 }}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={onVolver}
                  disabled={loading}
                  sx={{ flex: 1, borderRadius: 2, fontWeight: 600 }}
                >
                  Cancelar
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Información adicional */}
      <Paper elevation={2} sx={{ p: 2, mt: 3, borderRadius: 3, bgcolor: 'info.light' }}>
        <Typography variant="body2" color="info.contrastText">
          <strong>Nota:</strong> Solo se puede modificar la duración de la votación. 
          Esto afectará automáticamente la fecha de cierre calculada desde la fecha de inicio.
        </Typography>
      </Paper>
    </Box>
  );
};

export default VotacionEditar;
