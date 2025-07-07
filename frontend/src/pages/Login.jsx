// src/pages/Login.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Paper, Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login } from '@services/auth.service.js';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await login(form);
        if (response.status === 'Success') {
            navigate('/home');
        } else {
            setErrorMsg('Credenciales inválidas. Intenta de nuevo.');
        }
        } catch (error) {
        setErrorMsg('Ocurrió un error al iniciar sesión.');
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
            <form onSubmit={loginSubmit}>
            <TextField
                label="Correo institucional"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="email"
                required
                inputProps={{ maxLength: 100 }}
                autoFocus
            />
            <TextField
                label="Contraseña"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="password"
                required
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
                Iniciar sesión
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
