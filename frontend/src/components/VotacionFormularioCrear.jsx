
import { useVotacionFormularioCrear } from '@hooks/useVotacionFormularioCrear.jsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';


const FormularioCrearVotacion = ({ onSubmit, onSuccess, onCancel }) => {
    const {
        formData,
        errors,
        submitting,
        handleInputChange,
        handleOpcionChange,
        agregarOpcion,
        eliminarOpcion,
        handleSubmit
    } = useVotacionFormularioCrear({ onSubmit, onSuccess });

    return (
        <Paper elevation={4} sx={{ p: 3, borderRadius: 4, maxWidth: 520, mx: 'auto', mt: 3 }}>
            <form onSubmit={handleSubmit} autoComplete="off">
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Crear Nueva Votación
                </Typography>
                <Stack spacing={2}>
                    {/* Título */}
                    <TextField
                        label="Título de la Votación *"
                        value={formData.titulo}
                        onChange={(e) => handleInputChange('titulo', e.target.value)}
                        placeholder="Ej: Elección del nuevo presidente del CEE"
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
                            onClick={onCancel}
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
                            {submitting ? 'Creando...' : 'Crear Votación'}
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Paper>
    );
};

export default FormularioCrearVotacion;
