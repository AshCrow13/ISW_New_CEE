
import { useVotacionVistaActualizacion } from '@hooks/useVotacionVistaActualizacion.jsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const VistaActualizacion = ({ user, onActualizar }) => {
    const {
        step,
        searchId,
        setSearchId,
        votacionOriginal,
        formData,
        errors,
        loading,
        submitting,
        handleInputChange,
        handleOpcionChange,
        agregarOpcion,
        eliminarOpcion,
        handleSubmit,
        buscarVotacion,
        volverABuscar
    } = useVotacionVistaActualizacion({ user, onActualizar });

    if (!user || user.rol !== 'admin') {
        return (
            <Alert severity="error" sx={{ mt: 3 }}>
                No tienes permisos para actualizar votaciones
            </Alert>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 3 }}>
            {/* Paso 1: Buscar votación */}
            {step === 'buscar' && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Buscar Votación a Actualizar
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Ingresa el ID de la votación"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && buscarVotacion()}
                            sx={{ minWidth: 180 }}
                        />
                        <Button
                            variant="contained"
                            color="info"
                            onClick={buscarVotacion}
                            disabled={loading}
                            sx={{ fontWeight: 600 }}
                        >
                            {loading ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        Puedes obtener el ID desde la lista de "Ver Todas las Votaciones"
                    </Typography>
                </Paper>
            )}

            {/* Paso 2: Editar votación */}
            {step === 'editar' && votacionOriginal && votacionOriginal.id && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Actualizando Votación
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="body2"><strong>ID:</strong> {votacionOriginal.id}</Typography>
                            <Typography variant="body2">
                                <strong>Estado:</strong>{' '}
                                <Box component="span" sx={{
                                    display: 'inline-block',
                                    px: 1.2,
                                    py: 0.3,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    color: votacionOriginal.estado ? 'success.main' : 'error.main',
                                    backgroundColor: votacionOriginal.estado ? 'success.light' : 'error.light',
                                    fontSize: 14,
                                    ml: 0.5
                                }}>
                                    {votacionOriginal.estado ? 'Activa' : 'Inactiva'}
                                </Box>
                            </Typography>
                            <Typography variant="body2">
                                <strong>Creada:</strong> {
                                    (() => {
                                        try {
                                            const fechaCreacion = votacionOriginal.fecha_inicio || votacionOriginal.inicio;
                                            return new Date(fechaCreacion).toLocaleString();
                                        } catch (error) {
                                            return 'Fecha no disponible';
                                        }
                                    })()
                                }
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={volverABuscar}
                            sx={{ fontWeight: 600 }}
                        >
                            Buscar Otra Votación
                        </Button>
                    </Box>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <Stack spacing={2}>
                            {/* Título */}
                            <TextField
                                label="Título de la Votación *"
                                value={formData.titulo}
                                onChange={(e) => handleInputChange('titulo', e.target.value)}
                                placeholder="Título de la votación"
                                error={Boolean(errors.titulo)}
                                helperText={errors.titulo}
                                fullWidth
                            />
                            {/* Fechas */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    label="Fecha y Hora de Inicio *"
                                    type="datetime-local"
                                    value={formData.fechaInicio}
                                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                                    error={Boolean(errors.fechaInicio)}
                                    helperText={errors.fechaInicio}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                                <TextField
                                    label="Fecha y Hora de Fin *"
                                    type="datetime-local"
                                    value={formData.fechaFin}
                                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                                    error={Boolean(errors.fechaFin)}
                                    helperText={errors.fechaFin}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Stack>
                            {/* Opciones de votación */}
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    Opciones de Votación *
                                </Typography>
                                <Stack spacing={1}>
                                    {formData.opciones.map((opcion, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ minWidth: 20 }}>{index + 1}.</Typography>
                                            <TextField
                                                value={opcion}
                                                onChange={(e) => handleOpcionChange(index, e.target.value)}
                                                placeholder={`Opción ${index + 1}`}
                                                size="small"
                                                sx={{ flex: 1 }}
                                            />
                                            {formData.opciones.length > 2 && (
                                                <IconButton
                                                    aria-label="Eliminar opción"
                                                    color="error"
                                                    onClick={() => eliminarOpcion(index)}
                                                    size="small"
                                                >
                                                    ×
                                                </IconButton>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    onClick={agregarOpcion}
                                    sx={{ mt: 1, fontWeight: 600 }}
                                >
                                    + Agregar Opción
                                </Button>
                                {errors.opciones && (
                                    <Alert severity="error" sx={{ mt: 1 }}>{errors.opciones}</Alert>
                                )}
                            </Box>
                            {/* Botones de acción */}
                            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="inherit"
                                    onClick={volverABuscar}
                                    disabled={submitting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    disabled={submitting}
                                    sx={{ fontWeight: 600 }}
                                >
                                    {submitting ? 'Actualizando...' : 'Actualizar Votación'}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Paper>
            )}
        </Box>
    );
};

export default VistaActualizacion;
