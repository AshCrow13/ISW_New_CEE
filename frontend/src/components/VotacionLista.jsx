// Componente para mostrar la lista de votaciones
import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

const ListaVotaciones = ({ votaciones, loading, user, handleEliminar }) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Cargando votaciones...
                </Typography>
            </Box>
        );
    }

    if (votaciones.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                <Typography variant="body1" color="text.secondary">
                    No hay votaciones disponibles
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
            mt: 2
        }}>
            {votaciones.map((votacion, index) => {
                const isActiva = votacion.estado === true || votacion.estado === 'true';
                return (
                    <Paper
                        key={votacion.id || votacion._id || index}
                        elevation={3}
                        sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {votacion.nombre || votacion.titulo || 'Sin título'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>ID:</strong> {votacion.id || votacion._id || 'No disponible'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Estado:</strong>{' '}
                            <Box component="span" sx={{
                                display: 'inline-block',
                                px: 1.2,
                                py: 0.3,
                                borderRadius: 2,
                                fontWeight: 600,
                                color: isActiva ? 'success.main' : 'error.main',
                                backgroundColor: isActiva ? 'success.light' : 'error.light',
                                fontSize: 14,
                                ml: 0.5
                            }}>
                                {isActiva ? 'Activa' : 'Inactiva'}
                            </Box>
                        </Typography>
                        <Typography variant="body2">
                            <strong>Inicio:</strong> {votacion.inicio ? new Date(votacion.inicio).toLocaleString() : 'No definido'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Fin:</strong> {votacion.fin ? new Date(votacion.fin).toLocaleString() : 'No definido'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Duración:</strong> {votacion.duracion ? `${votacion.duracion} minutos` : 'No definida'}
                        </Typography>
                        {user && (user.rol === 'admin' || user.rol === 'vocalia') && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleEliminar(votacion.id || votacion._id)}
                                    sx={{ fontWeight: 600, borderRadius: 2 }}
                                >
                                    Eliminar
                                </Button>
                            </Stack>
                        )}
                    </Paper>
                );
            })}
        </Box>
    );
};

export default ListaVotaciones;
