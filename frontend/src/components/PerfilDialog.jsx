import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { updateUser, deleteUser } from '../services/user.service';

export default function PerfilDialog({ open, onClose }) { // Componente de diálogo para el perfil del usuario
    const { user } = useAuth();

    // Si user es null, mostrar mensaje de error y botón para cerrar
    if (!user) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogTitle>Perfil de usuario</DialogTitle>
                <DialogContent>
                    <Typography color="error" sx={{ mb: 2 }}>
                        No se pudo cargar la información del usuario.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant="contained">Cerrar</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const [nombre, setNombre] = useState(user?.nombreCompleto || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpdate = async () => { // Función para actualizar el perfil
        setLoading(true);
        setError('');
        setSuccess('');
        try { // Actualiza el perfil del usuario
            await updateUser({ nombreCompleto: nombre, newPassword: password }, user.rut);
            setSuccess('Perfil actualizado correctamente');
            setPassword('');
        } catch (err) {
            setError('Error al actualizar el perfil');
        }
        setLoading(false);
    };

    const handleDelete = async () => { // Función para eliminar la cuenta del usuario
        if (!window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
        setLoading(true);
        setError('');
        try { // Elimina la cuenta del usuario
            await deleteUser(user.rut);
            setLoading(false);
            window.sessionStorage.clear(); // Limpia el almacenamiento de sesión
            window.location.href = '/auth'; // Redirige al usuario a la página de autenticación
        } catch (err) {
        setError('Error al eliminar la cuenta');
        setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Perfil de usuario</DialogTitle>
        <DialogContent>
            <Typography variant="subtitle2" color="textSecondary">Correo: {user.email}</Typography>
            <Typography variant="subtitle2" color="textSecondary">RUT: {user.rut}</Typography>
            <TextField
            margin="normal"
            label="Nombre completo"
            fullWidth
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            inputProps={{ minLength: 5, maxLength: 50 }}
            />
            <TextField
            margin="normal"
            label="Nueva contraseña"
            type="password"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            inputProps={{ minLength: 6, maxLength: 30 }}
            />
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}
        </DialogContent>
        <DialogActions>
            <Box flexGrow={1}>
            <IconButton color="error" onClick={handleDelete} disabled={loading}>
                <DeleteIcon />
            </IconButton>
            </Box>
            <Button onClick={onClose} disabled={loading}>Cerrar</Button>
            <Button onClick={handleUpdate} variant="contained" disabled={loading}>Guardar</Button>
        </DialogActions>
        </Dialog>
    );
}
