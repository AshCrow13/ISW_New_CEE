import ActividadForm from '@components/ActividadForm';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, TextField, Card, CardContent, CardActions, Grid, Pagination, IconButton, InputAdornment } from '@mui/material';
import { getActividades, createActividad, updateActividad, deleteActividad, getProximasActividades } from '@services/actividad.service.js';
import { useAuth } from '@context/AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import ListAltIcon from '@mui/icons-material/ListAlt';

const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const [proximasActividades, setProximasActividades] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState(null); // Para edición
    const [loading, setLoading] = useState(false);
    const [verTodas, setVerTodas] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [filtrosAvanzados, setFiltrosAvanzados] = useState({
        titulo: '',
        lugar: '',
        categoria: '',
        fecha: ''
    });
    const { user } = useAuth();

    // Cargar actividades según la vista
    useEffect(() => {
        if (user?.rol === 'estudiante' && !verTodas) {
            fetchProximasActividades();
        } else {
            fetchAllActividades();
        }
    }, [user?.rol, verTodas, paginaActual]);

    // Fetch próximas actividades (solo 5)
    const fetchProximasActividades = async () => {
        setLoading(true);
        try {
            const res = await getProximasActividades(5);
            setProximasActividades(res);
        } catch (e) {
            showErrorAlert('Error', 'No se pudieron cargar las actividades próximas');
        }
        setLoading(false);
    };

    // Fetch todas las actividades (con paginación)
    const fetchAllActividades = async () => {
        setLoading(true);
        try {
            // Construir parámetros de filtro
            const params = {
                limit: 20, // 20 por página
                offset: (paginaActual - 1) * 20
            };

            // Añadir filtros avanzados si existen
            if (filtrosAvanzados.titulo) params.q = filtrosAvanzados.titulo;
            if (filtrosAvanzados.lugar) params.lugar = filtrosAvanzados.lugar;
            if (filtrosAvanzados.categoria) params.categoria = filtrosAvanzados.categoria;
            if (filtrosAvanzados.fecha) params.fechaInicio = filtrosAvanzados.fecha;

            const res = await getActividades(params);
            setActividades(res);
            
            // Calcular total de páginas (aproximado)
            setTotalPaginas(Math.ceil(res.length > 0 ? res.length / 20 + 2 : 1));
        } catch (e) {
            showErrorAlert('Error', 'No se pudieron cargar las actividades');
        }
        setLoading(false);
    };

    // Aplicar filtros
    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    // Aplicar filtros avanzados
    const handleFiltroAvanzadoChange = (campo, valor) => {
        setFiltrosAvanzados(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    // Aplicar búsqueda avanzada
    const handleBusquedaAvanzada = () => {
        setPaginaActual(1); // Volver a la primera página
        fetchAllActividades();
    };

    // Cambio de página
    const handlePageChange = (event, value) => {
        setPaginaActual(value);
    };

    // Filtrar actividades en memoria para la DataGrid
    const filteredRows = useMemo(
        () => filtro
            ? actividades.filter(
                (row) =>
                row.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
                row.lugar?.toLowerCase().includes(filtro.toLowerCase()) ||
                row.categoria?.toLowerCase().includes(filtro.toLowerCase())
            )
            : actividades,
        [actividades, filtro]
    );

    // Columnas para la DataGrid
    const columns = [
        { field: 'titulo', headerName: 'Título', flex: 1 },
        { field: 'descripcion', headerName: 'Descripción', flex: 2 },
        { 
            field: 'fecha', 
            headerName: 'Fecha', 
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleDateString('es-ES')
        },
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
                                    fetchAllActividades();
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
            fetchAllActividades();
        } catch (e) {
            showErrorAlert('Error', e.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    // Vista para usuarios estudiantes (próximas actividades)
    const renderProximasActividades = () => (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Próximas Actividades</Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<ListAltIcon />}
                    onClick={() => setVerTodas(true)}
                >
                    Ver todas las actividades
                </Button>
            </Stack>

            {loading ? (
                <Typography>Cargando actividades...</Typography>
            ) : proximasActividades.length === 0 ? (
                <Typography>No hay actividades próximas programadas.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {proximasActividades.map((actividad) => (
                        <Grid item xs={12} sm={6} md={4} key={actividad.id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{actividad.titulo}</Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2} 
                                        sx={{ 
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {actividad.descripcion}
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CalendarTodayIcon fontSize="small" color="primary" />
                                            <Typography variant="body2">
                                                {new Date(actividad.fecha).toLocaleDateString('es-ES')}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LocationOnIcon fontSize="small" color="primary" />
                                            <Typography variant="body2">{actividad.lugar}</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CategoryIcon fontSize="small" color="primary" />
                                            <Typography variant="body2">{actividad.categoria}</Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );

    // Vista para todas las actividades con filtros y paginación
    const renderTodasActividades = () => (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Todas las Actividades</Typography>
                {user?.rol === 'estudiante' && (
                    <Button 
                        variant="outlined"
                        onClick={() => setVerTodas(false)}
                    >
                        Ver solo próximas
                    </Button>
                )}
            </Stack>

            {/* Filtros avanzados */}
            <Card sx={{ mb: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Búsqueda avanzada</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Título"
                                variant="outlined"
                                fullWidth
                                value={filtrosAvanzados.titulo}
                                onChange={(e) => handleFiltroAvanzadoChange('titulo', e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Lugar"
                                variant="outlined"
                                fullWidth
                                value={filtrosAvanzados.lugar}
                                onChange={(e) => handleFiltroAvanzadoChange('lugar', e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                label="Categoría"
                                variant="outlined"
                                fullWidth
                                value={filtrosAvanzados.categoria}
                                onChange={(e) => handleFiltroAvanzadoChange('categoria', e.target.value)}
                                SelectProps={{
                                    native: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <option value="">Todas</option>
                                <option value="Deportivo">Deportivo</option>
                                <option value="Recreativo">Recreativo</option>
                                <option value="Oficial">Oficial</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Fecha desde"
                                type="date"
                                variant="outlined"
                                fullWidth
                                value={filtrosAvanzados.fecha}
                                onChange={(e) => handleFiltroAvanzadoChange('fecha', e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleBusquedaAvanzada}
                    >
                        Buscar
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => {
                            setFiltrosAvanzados({
                                titulo: '',
                                lugar: '',
                                categoria: '',
                                fecha: ''
                            });
                            setPaginaActual(1);
                            fetchAllActividades();
                        }}
                    >
                        Limpiar filtros
                    </Button>
                </CardActions>
            </Card>

            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    loading={loading}
                    disableRowSelectionOnClick
                />
            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination 
                    count={totalPaginas} 
                    page={paginaActual}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Actividades
            </Typography>
            
            {/* Botón para crear actividades (solo admin y vocalia) */}
            {(user?.rol === 'admin' || user?.rol === 'vocalia') && (
                <Button
                    variant="contained"
                    sx={{ mb: 3 }}
                    onClick={() => {
                        setFormData(null);
                        setFormOpen(true);
                    }}
                >
                    Nueva actividad
                </Button>
            )}
            
            {/* Mostrar vista según rol y estado */}
            {user?.rol === 'estudiante' && !verTodas 
                ? renderProximasActividades() 
                : renderTodasActividades()
            }

            {/* Formulario de crear/editar (modal) */}
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
                        initialData={formData || {}}
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
