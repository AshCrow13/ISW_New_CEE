import ActividadForm from '@components/ActividadForm';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, TextField } from '@mui/material';
import { getActividades, createActividad, updateActividad, deleteActividad } from '@services/actividad.service.js';
import { useAuth } from '@context/AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState(null); // Para edición
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchActividades();
    }, []);

    const fetchActividades = async () => {
        setLoading(true);
        try {
        const res = await getActividades();
        setActividades(res);
        } catch (e) {
        showErrorAlert('Error', 'No se pudo cargar actividades');
        }
        setLoading(false);
    };

    // Mapea datos
    const rows = useMemo(
        () =>
        actividades.map((act, i) => ({
            id: act.id || i, // Usa id real si existe
            ...act
        })),
        [actividades]
    );

    // Filtra por título/lugar/categoría
    const filteredRows = useMemo(
        () =>
        filtro
            ? rows.filter(
                (row) =>
                row.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
                row.lugar?.toLowerCase().includes(filtro.toLowerCase()) ||
                row.categoria?.toLowerCase().includes(filtro.toLowerCase())
            )
            : rows,
        [rows, filtro]
    );

    // Columnas
    const columns = [
        { field: 'titulo', headerName: 'Título', flex: 1 },
        { field: 'descripcion', headerName: 'Descripción', flex: 2 },
        { field: 'fecha', headerName: 'Fecha', flex: 1 },
        { field: 'lugar', headerName: 'Lugar', flex: 1 },
        { field: 'categoria', headerName: 'Categoría', flex: 1 },
        ...(user?.rol === 'admin' || user?.rol === 'vocalia'
        ? [
            {
                field: 'acciones',
                headerName: 'Acciones',
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        setFormData(params.row);
                        setFormOpen(true);
                    }}
                    >
                    Editar
                    </Button>
                    <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={async () => {
                        if (window.confirm('¿Eliminar actividad?')) {
                        try {
                            await deleteActividad(params.row.id);
                            showSuccessAlert('Eliminada', 'Actividad eliminada');
                            fetchActividades();
                        } catch (e) {
                            showErrorAlert('Error', e.message || 'Ocurrió un error');
                        }
                        }
                    }}
                    >
                    Eliminar
                    </Button>
                </Stack>
                ),
            },
            ]
        : []),
    ];

    // Submit crear/editar
    const onSubmit = async (data) => {
        setLoading(true);
        try {
        if (formData) {
            await updateActividad(formData.id, data);
            showSuccessAlert('Editada', 'Actividad editada');
        } else {
            await createActividad(data);
            showSuccessAlert('Creada', 'Actividad creada');
        }
        setFormOpen(false);
        setFormData(null);
        fetchActividades();
        } catch (e) {
        showErrorAlert('Error', e.message || 'Ocurrió un error');
        } finally {
        setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
            Gestión de Actividades
        </Typography>
        {(user?.rol === 'admin' || user?.rol === 'vocalia') && (
            <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => {
                setFormData(null);
                setFormOpen(true);
            }}
            >
            Nueva actividad
            </Button>
        )}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
            label="Buscar por título, lugar o categoría"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            size="small"
            />
        </Stack>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            loading={loading}
            disableRowSelectionOnClick
            />
        </Box>
        {/* Formulario de crear/editar */}
        <Dialog
        open={formOpen}
        onClose={() => {
            setFormOpen(false);
            setFormData(null);
        }}
        maxWidth="sm"
        fullWidth
        >
        <DialogTitle>
            {formData ? "Editar Actividad" : "Nueva Actividad"}
        </DialogTitle>
        <DialogContent>
            <ActividadForm
            initialData={formData || {}} // Pasa datos iniciales si está editando
            onSubmit={onSubmit}
            onCancel={() => {
                setFormOpen(false);
                setFormData(null);
            }}
            isEditing={!!formData}
            loading={loading}
            />
        </DialogContent>
        </Dialog>

        </Box>
    );
};

export default Actividades;
