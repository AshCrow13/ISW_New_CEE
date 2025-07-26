import { useState, useEffect, useMemo } from 'react';
import { getHistorial } from '@services/historial.service.js';
import { useAuth } from '@context/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Stack, TextField } from '@mui/material';

const Historial = () => { // Componente para mostrar el historial de acciones
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const { user } = useAuth(); // Obtener información del usuario autenticado**

    useEffect(() => { // Cargar historial al montar el componente
        fetchHistorial();
    }, []);

    const fetchHistorial = async () => {
        setLoading(true);
        try {
            const data = await getHistorial(); // Llamada al servicio para obtener el historial
            setHistorial(Array.isArray(data) ? data : []);
        } catch (error) { // Manejo de errores al cargar el historial
            console.error('Error al cargar historial:', error);
            setHistorial([]);
        }
        setLoading(false);
    };

    // Columnas más directas
    const columns = [ // directamente los campos del backend
        { field: 'id', headerName: 'ID', width: 80 },
        { 
            field: 'fecha', 
            headerName: 'Fecha', 
            flex: 1,
            renderCell: (params) => { // Formatear la fecha
                if (!params.row.fecha) return '-';
                return new Date(params.row.fecha).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        },
        { 
            field: 'usuario', 
            headerName: 'Usuario', 
            flex: 1
            // directamente el campo, sin valueGetter
        },
        { field: 'accion', headerName: 'Acción', flex: 0.8 },
        { field: 'tipo', headerName: 'Tipo', flex: 0.8 },
        { 
            field: 'detalle', 
            headerName: 'Detalle', 
            flex: 2
            // directamente el campo, sin valueGetter
        }
    ];

    // Filtrado más seguro
    const filteredRows = useMemo(() => { // Filtrar historial según el texto de búsqueda
        if (!filter) return historial;
        return historial.filter(row => { // Verificar que row sea un objeto y tenga los campos necesarios
            if (!row || typeof row !== 'object') return false;
            
            const usuario = typeof row.usuario === 'string' ? row.usuario : row.usuario?.nombreCompleto || '';
            const accion = row.accion || ''; // Acción realizada
            const detalle = row.detalle || ''; // Detalle de la acción

            return usuario.toLowerCase().includes(filter.toLowerCase()) || 
                    accion.toLowerCase().includes(filter.toLowerCase()) ||
                    detalle.toLowerCase().includes(filter.toLowerCase());
        });
    }, [historial, filter]); // Filtrar historial según el texto de búsqueda

    // Usar directamente los datos del backend
    const rows = useMemo( // Transformar los datos filtrados en un formato adecuado para DataGrid
        () => filteredRows
            .filter(row => row && typeof row === 'object')
            .map((row, idx) => ({ 
                ...row, // Usar todos los campos del backend
                id: row.id ?? idx // Asegurar que cada fila tenga un ID único
            })),
        [filteredRows]
    );

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={6} sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Historial de acciones
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        label="Buscar por usuario, acción o detalle"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        size="small"
                        sx={{ width: 400, maxWidth: "100%" }}
                    />
                </Stack>
                <Box sx={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        loading={loading}
                        disableRowSelectionOnClick
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: 2,
                            boxShadow: 1,
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default Historial;
