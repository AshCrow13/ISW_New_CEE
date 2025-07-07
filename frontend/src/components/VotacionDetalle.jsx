// Componente para mostrar los detalles de una votación específica
import React from 'react';
import { useVotacionDetalle } from '@hooks/useVotacionDetalle.jsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';


const DetalleVotacion = (props) => {
    const { votacionSeleccionada, user, handleEliminar, conteo, votos, loadingResultados, errorResultados } = useVotacionDetalle(props);
    const { handleVotar } = props;

    if (props.loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Buscando votación...
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
    return (
        <Paper elevation={4} sx={{ p: 3, borderRadius: 4, maxWidth: 600, mx: 'auto', mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {votacionSeleccionada.titulo}
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2"><strong>ID:</strong> {votacionSeleccionada.id}</Typography>
                <Typography variant="body2"><strong>Nombre:</strong> {votacionSeleccionada.nombre}</Typography>
                <Typography variant="body2"><strong>Inicio:</strong> {new Date(votacionSeleccionada.inicio).toLocaleString()}</Typography>
                <Typography variant="body2"><strong>Fin:</strong> {new Date(votacionSeleccionada.fin).toLocaleString()}</Typography>
                <Typography variant="body2"><strong>Duración:</strong> {votacionSeleccionada.duracion} minutos</Typography>
                <Typography variant="body2">
                    <strong>Estado:</strong>{' '}
                    <Box component="span" sx={{
                        display: 'inline-block',
                        px: 1.2,
                        py: 0.3,
                        borderRadius: 2,
                        fontWeight: 600,
                        color: votacionSeleccionada.estado ? 'success.main' : 'error.main',
                        backgroundColor: votacionSeleccionada.estado ? 'success.light' : 'error.light',
                        fontSize: 14,
                        ml: 0.5
                    }}>
                        {votacionSeleccionada.estado ? 'Abierta' : 'Cerrada'}
                    </Box>
                </Typography>
            </Box>
            {votacionSeleccionada.opciones && votacionSeleccionada.opciones.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Opciones de votación:
                    </Typography>
                    <Stack spacing={1}>
                        {votacionSeleccionada.opciones.map((opcion, index) => (
                            <Box key={opcion.id || index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, backgroundColor: 'background.default' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 24 }}>{index + 1}</Typography>
                                <Typography variant="body2">{typeof opcion === 'string' ? opcion : opcion.texto}</Typography>
                                {votacionSeleccionada.estado && handleVotar && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 2, fontWeight: 600, borderRadius: 2 }}
                                        onClick={() => handleVotar(votacionSeleccionada.id, opcion.id)}
                                    >
                                        Votar
                                    </Button>
                                )}
                                {!votacionSeleccionada.estado && conteo.length > 0 && (
                                    <Typography variant="body2" sx={{ ml: 2, fontWeight: 700 }}>
                                        Votos: {conteo.find(c => c.opcionId === opcion.id)?.cantidad || 0}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </Box>
            ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Esta votación no tiene opciones configuradas
                </Alert>
            )}
            {/* Resultados de votos individuales si la votación está cerrada */}
            {!votacionSeleccionada.estado && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Resultados de la votación
                    </Typography>
                    {loadingResultados && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2">Cargando resultados...</Typography>
                        </Box>
                    )}
                    {errorResultados && (
                        <Alert severity="error">{errorResultados}</Alert>
                    )}
                    {!loadingResultados && !errorResultados && (
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Votos registrados:
                            </Typography>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {votos.length > 0 ? votos.map((v, idx) => {
                                    let opcionStr = v.opcionTexto;
                                    if (!opcionStr && v.opcion && typeof v.opcion === 'object') {
                                        opcionStr = v.opcion.texto || v.opcion.nombre || v.opcion.id;
                                    } else if (!opcionStr) {
                                        opcionStr = v.opcionId;
                                    }
                                    return (
                                        <li key={v.id || idx}>
                                            Voto registrado por <strong>{opcionStr}</strong>
                                        </li>
                                    );
                                }) : <li>No hay votos registrados.</li>}
                            </ul>
                        </Box>
                    )}
                </Box>
            )}
            {user && user.rol === 'admin' && (
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleEliminar(votacionSeleccionada.id)}
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                    >
                        Eliminar
                    </Button>
                </Stack>
            )}
        </Paper>
    );
};

export default DetalleVotacion;
