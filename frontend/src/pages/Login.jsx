// src/pages/Login.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Paper, Container, TextField, Button, Typography, Box, Alert, Tabs, Tab, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { login } from '@services/auth.service.js';
import { formatRutOnChange } from '@helpers/formatRut.js';

const Login = () => {
    const navigate = useNavigate();
    const [authType, setAuthType] = useState('email');
    const [form, setForm] = useState({ 
        email: '', 
        rut: '', 
        password: '' 
    });
    const [errors, setErrors] = useState({
        email: '',
        rut: '',
        password: '',
        general: ''
    });
    const [loading, setLoading] = useState(false);

    const handleAuthTypeChange = (event, newValue) => {
        setAuthType(newValue);
        setErrors({
            email: '',
            rut: '',
            password: '',
            general: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Aplicar formato de RUT automáticamente mientras el usuario escribe
        if (name === 'rut') {
            setForm(prev => ({ ...prev, [name]: formatRutOnChange(value) }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        
        // Limpiar error específico cuando el usuario empieza a corregir
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Limpiar errores previos
        setErrors({
            email: '',
            rut: '',
            password: '',
            general: ''
        });
        
        try {
            // Solo enviar el campo relevante según el tipo de autenticación
            const loginData = {
                password: form.password,
                ...(authType === 'email' ? { email: form.email } : { rut: form.rut })
            };

            const response = await login(loginData);
            
            if (response.status === 'Success') {
                navigate('/home');
            } else {
                // Manejar diferentes tipos de errores
                if (response.dataInfo === 'email') {
                    setErrors(prev => ({ ...prev, email: response.message }));
                } else if (response.dataInfo === 'rut') {
                    setErrors(prev => ({ ...prev, rut: response.message }));
                } else if (response.dataInfo === 'password') {
                    setErrors(prev => ({ ...prev, password: response.message }));
                } else if (response.dataInfo === 'connection') {
                    setErrors(prev => ({ ...prev, general: 'Error de conexión: ' + response.message }));
                } else {
                    setErrors(prev => ({ ...prev, general: response.message || 'Error de autenticación' }));
                }
            }
        } catch (error) {
            setErrors(prev => ({ ...prev, general: 'Ocurrió un error inesperado. Inténtalo de nuevo.' }));
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
                    <LockOutlinedIcon sx={{ fontSize: 48, color: "primary.main" }} />
                    <Typography variant="h5" mb={1}>Iniciar sesión</Typography>
                </Box>
                
                <Tabs
                    value={authType}
                    onChange={handleAuthTypeChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ mb: 2 }}
                >
                    <Tab value="email" label="Correo" />
                    <Tab value="rut" label="RUT" />
                </Tabs>

                <form onSubmit={loginSubmit}>
                    {authType === 'email' ? (
                        <>
                            <TextField
                                label="Correo institucional"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                type="email"
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                                inputProps={{ maxLength: 100 }}
                                autoFocus
                            />
                            <FormHelperText component="span">
                                <Box display="flex" alignItems="center">
                                    <div>Contenido</div>
                                </Box>
                            </FormHelperText>
                        </>
                    ) : (
                        <>
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
                                placeholder="12.345.678-9"
                                inputProps={{ maxLength: 12 }}
                                autoFocus
                            />
                            <FormHelperText component="span">
                                <Box display="flex" alignItems="center">
                                    <div>Contenido</div>
                                </Box>
                            </FormHelperText>
                        </>
                    )}
                    
                    <TextField
                        label="Contraseña"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        type="password"
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                        inputProps={{ maxLength: 26 }}
                    />
                    
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
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>
                    
                    <Typography align="center" sx={{ mt: 1 }}>
                        ¿No tienes cuenta? <Button variant="text" onClick={() => navigate('/register')}>Regístrate aquí</Button>
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
