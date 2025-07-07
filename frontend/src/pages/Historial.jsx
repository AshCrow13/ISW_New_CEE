import { useState, useEffect, useMemo } from 'react';
import { getHistorial } from '@services/historial.service.js';
import { useAuth } from '@context/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Stack, TextField } from '@mui/material';

const Historial = () => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchHistorial();
        // eslint-disable-next-line
    }, []);

    const fetchHistorial = async () => {
        setLoading(true);
        const data = await getHistorial();
        setHistorial(data);
        setLoading(false);
    };

    // Define columnas para DataGrid (ajusta los nombres de campo según tu backend)
    const columns = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'usuario', headerName: 'Usuario', flex: 1, valueGetter: (params) => params.row.usuario?.nombreCompleto || params.row.usuario || '-' },
        { field: 'accion', headerName: 'Acción', flex: 1 },
        { field: 'detalle', headerName: 'Detalle', flex: 2 },
        { field: 'fecha', headerName: 'Fecha', flex: 1 }
    ];

    // Filtra filas según lo que escriba el usuario (por nombre o acción)
    const filteredRows = useMemo(() => {
        if (!filter) return historial;
        return historial.filter(row =>
            (row.usuario?.nombreCompleto || row.usuario || '').toLowerCase().includes(filter.toLowerCase()) ||
            (row.accion || '').toLowerCase().includes(filter.toLowerCase()) ||
            (row.detalle || '').toLowerCase().includes(filter.toLowerCase())
        );
    }, [historial, filter]);

    // Añade campo `id` si tus registros no lo tienen (DataGrid lo exige)
    const rows = useMemo(
        () => filteredRows.map((row, idx) => ({ ...row, id: row.id ?? idx })),
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
