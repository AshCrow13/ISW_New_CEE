// Componente para el menú principal de votaciones
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

const MenuPrincipalVotaciones = ({ 
    user, 
    searchId, 
    setSearchId, 
    setView, 
    handleVerTodas, 
    handleVerUna 
}) => {
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mt: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
                {/* Solo mostrar el botón de crear si el usuario NO es estudiante */}
                {user && user.rol !== 'estudiante' && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setView('crear')}
                        sx={{ minWidth: 180, fontWeight: 600, boxShadow: 2 }}
                    >
                        Crear Nueva Votación
                    </Button>
                )}

                <Button
                    variant="contained"
                    color="info"
                    onClick={handleVerTodas}
                    sx={{ minWidth: 180, fontWeight: 600, boxShadow: 2 }}
                >
                    Ver Todas las Votaciones
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="ID de votación..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        sx={{ backgroundColor: 'background.paper', borderRadius: 1, minWidth: 140 }}
                        inputProps={{ style: { padding: '8px 10px' } }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleVerUna}
                        sx={{ fontWeight: 600, boxShadow: 2 }}
                    >
                        Buscar Votación
                    </Button>
                </Box>

                {user && user.rol !== 'estudiante' && (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => setView('actualizar')}
                        sx={{ minWidth: 180, fontWeight: 600, boxShadow: 2, color: 'white' }}
                    >
                        Actualizar Votación
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default MenuPrincipalVotaciones;
