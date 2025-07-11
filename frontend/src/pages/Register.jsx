// src/pages/Register.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Paper, Container, TextField, Button, Typography, Box, Alert, FormHelperText } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import InfoIcon from '@mui/icons-material/Info';
import { register } from '@services/auth.service.js';
import { showSuccessAlert } from '@helpers/sweetAlert.js';

// Expresión regular para RUT chileno (solo con puntos)
const rutRegex = /^(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}-[\dkK]$/;

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombreCompleto: '',
        email: '',
        rut: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        nombreCompleto: '',
        email: '',
        rut: '',
        password: '',
        general: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // Limpiar error específico cuando el usuario empieza a corregir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Validar nombre completo
        if (!form.nombreCompleto || form.nombreCompleto.length < 8) {
            newErrors.nombreCompleto = 'El nombre completo debe tener al menos 8 caracteres';
            isValid = false;
        }

        // Validar correo
        if (!form.email) {
            newErrors.email = 'El correo es requerido';
            isValid = false;
        } else if (!form.email.match(/@(alumnos\.)?ubiobio\.cl$/)) {
            newErrors.email = 'Debe ser un correo institucional';
            isValid = false;
        }

        // Validar RUT
        if (!form.rut) {
            newErrors.rut = 'El RUT es requerido';
            isValid = false;
        } else if (!rutRegex.test(form.rut)) {
            newErrors.rut = 'Formato inválido. Debe ser xx.xxx.xxx-x';
            isValid = false;
        }

        // Validar contraseña
        if (!form.password) {
            newErrors.password = 'La contraseña es requerida';
            isValid = false;
        } else if (form.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const registerSubmit = async (e) => {
        e.preventDefault();
        
        // Validar formulario antes de enviar
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await register(form);
            
            if (response.status === 'Success') {
                // Mostrar mensaje de éxito antes de redireccionar
                showSuccessAlert(
                    '¡Registro exitoso!', 
                    'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.'
                );
                
                // Redireccionar después de un breve retraso
                setTimeout(() => {
                    navigate('/auth');
                }, 2000);
            } else {
                // Manejar diferentes tipos de errores
                if (response.dataInfo) {
                    if (response.dataInfo === 'email') {
                        setErrors(prev => ({ ...prev, email: response.message }));
                    } else if (response.dataInfo === 'rut') {
                        setErrors(prev => ({ ...prev, rut: response.message }));
                    } else if (response.dataInfo === 'password') {
                        setErrors(prev => ({ ...prev, password: response.message }));
                    } else if (response.dataInfo === 'nombreCompleto') {
                        setErrors(prev => ({ ...prev, nombreCompleto: response.message }));
                    } else {
                        setErrors(prev => ({ ...prev, general: response.message || 'Error de registro' }));
                    }
                } else {
                    setErrors(prev => ({ 
                        ...prev, 
                        general: response.message || 'Error al registrar. Verifique sus datos e intente nuevamente.' 
                    }));
                }
            }
        } catch (error) {
            setErrors(prev => ({ 
                ...prev, 
                general: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.' 
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Paper elevation={8} sx={{ p: 4, borderRadius: 4, width: 1 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                    <PersonAddAltIcon sx={{ fontSize: 48, color: "primary.main" }} />
                    <Typography variant="h5" mb={1}>Registrarse</Typography>
                </Box>
                <form onSubmit={registerSubmit}>
                    <TextField
                        label="Nombre completo"
                        name="nombreCompleto"
                        value={form.nombreCompleto}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.nombreCompleto}
                        helperText={errors.nombreCompleto}
                        inputProps={{ maxLength: 50 }}
                    />
                    <TextField
                        label="Correo institucional"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email}
                        inputProps={{ maxLength: 100 }}
                    />
                    <FormHelperText sx={{ mt: -1, mb: 1, ml: 2, display: 'flex', alignItems: 'center' }}>
                        <InfoIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.8rem', color: 'text.secondary' }} />
                        <span>Debe ser un correo institucional</span>
                    </FormHelperText>

                    <TextField
                        label="RUT"
                        name="rut"
                        value={form.rut}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.rut}
                        helperText={errors.rut}
                        inputProps={{ maxLength: 12 }}
                        placeholder="12.345.678-9"
                    />
                    <FormHelperText sx={{ mt: -1, mb: 1, ml: 2, display: 'flex', alignItems: 'center' }}>
                        <InfoIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.8rem', color: 'text.secondary' }} />
                        <span>Formato: 12.345.678-9</span>
                    </FormHelperText>

                    <TextField
                        label="Contraseña"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password}
                        inputProps={{ maxLength: 26 }}
                    />
                    <FormHelperText sx={{ mt: -1, mb: 1, ml: 2, display: 'flex', alignItems: 'center' }}>
                        <InfoIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.8rem', color: 'text.secondary' }} />
                        <span>Mínimo 8 caracteres</span>
                    </FormHelperText>

                    {errors.general && (
                        <Alert severity="error" sx={{ mt: 2 }}>{errors.general}</Alert>
                    )}
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </Button>
                    
                    <Typography align="center" sx={{ mt: 1 }}>
                        ¿Ya tienes cuenta? <Button variant="text" onClick={() => navigate('/auth')}>Inicia sesión</Button>
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;