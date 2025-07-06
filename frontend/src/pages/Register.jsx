// src/pages/Register.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Paper, Container, TextField, Button, Typography, Box, Alert, InputAdornment } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { register } from '@services/auth.service.js';

const patternRut = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[\dkK]$/;

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombreCompleto: '',
        email: '',
        rut: '',
        password: ''
    });
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const registerSubmit = async (e) => {
        e.preventDefault();
        // Validaciones extra opcionales
        if (!patternRut.test(form.rut)) {
        setErrorMsg('El RUT debe tener formato xx.xxx.xxx-x');
        return;
        }
        if (form.nombreCompleto.length < 8) {
        setErrorMsg('El nombre completo es demasiado corto');
        return;
        }
        try {
        const response = await register(form);
        if (response.status === 'Success') {
            navigate('/auth');
        } else {
            setErrorMsg('No se pudo registrar. ¿El correo o rut ya están en uso?');
        }
        } catch {
        setErrorMsg('Ocurrió un error al registrar.');
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
                inputProps={{ maxLength: 100 }}
            />
            <TextField
                label="RUT"
                name="rut"
                value={form.rut}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                inputProps={{ maxLength: 12 }}
                placeholder="12.345.678-9"
            />
            <TextField
                label="Contraseña"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                type="password"
                inputProps={{ maxLength: 26 }}
            />
            {errorMsg && <Alert severity="error" sx={{ mt: 2 }}>{errorMsg}</Alert>}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 1 }}
            >
                Registrarse
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