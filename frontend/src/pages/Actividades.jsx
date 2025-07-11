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
        fechaInicio: '',
        fechaFin: ''
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
            if (filtrosAvanzados.fechaInicio) params.fechaInicio = filtrosAvanzados.fechaInicio;
            if (filtrosAvanzados.fechaFin) params.fechaFin = filtrosAvanzados.fechaFin;

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
    const renderProximasActividades = () => {
        // Función para obtener el color según la categoría
        const getCategoryColor = (categoria) => {
            switch (categoria) {
                case 'Deportivo': return '#2e7d32'; // Verde
                case 'Recreativo': return '#1565c0'; // Azul
                case 'Oficial': return '#c62828'; // Rojo
                default: return '#616161'; // Gris por defecto
            }
        };
        
        // Función para formatear la fecha con hora
        const formatDateTime = (dateString) => {
            const date = new Date(dateString);
            return {
                fecha: date.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),
                hora: date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
        };

        return (
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
                    <Box display="flex" justifyContent="center" p={4}>
                        <Typography>Cargando actividades...</Typography>
                    </Box>
                ) : proximasActividades.length === 0 ? (
                    <Box textAlign="center" p={4} bgcolor="#f5f5f5" borderRadius={2}>
                        <Typography>No hay actividades próximas programadas.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {proximasActividades.map((actividad) => {
                            const { fecha, hora } = formatDateTime(actividad.fecha);
                            const categoryColor = getCategoryColor(actividad.categoria);
                            
                            return (
                                <Grid item xs={12} sm={6} key={actividad.id}>
                                    <Card 
                                        elevation={3}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            overflow: 'visible',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                transition: 'transform 0.3s ease'
                                            }
                                        }}
                                    >
                                        {/* Banda de color según categoría */}
                                        <Box 
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '8px',
                                                backgroundColor: categoryColor
                                            }}
                                        />
                                        
                                        {/* Chip de categoría */}
                                        <Box position="absolute" top={15} right={16}>
                                            <Box
                                                sx={{
                                                    backgroundColor: categoryColor,
                                                    color: 'white',
                                                    borderRadius: '16px',
                                                    padding: '4px 12px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {actividad.categoria}
                                            </Box>
                                        </Box>
                                        
                                        <CardContent sx={{ pt: 4, pb: 2, flexGrow: 1 }}>
                                            <Typography variant="h5" gutterBottom fontWeight="bold" mt={1}>
                                                {actividad.titulo}
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                color="text.secondary" 
                                                mb={3} 
                                                sx={{ 
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 4,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    minHeight: '80px'
                                                }}
                                            >
                                                {actividad.descripcion}
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <CalendarTodayIcon fontSize="small" color="primary" />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {fecha}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Hora: {hora}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <LocationOnIcon fontSize="small" color="primary" />
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {actividad.lugar}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        );
    };

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
                                value={filtrosAvanzados.fechaInicio}
                                onChange={(e) => handleFiltroAvanzadoChange('fechaInicio', e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Fecha hasta"
                                type="date"
                                variant="outlined"
                                fullWidth
                                value={filtrosAvanzados.fechaFin}
                                onChange={(e) => handleFiltroAvanzadoChange('fechaFin', e.target.value)}
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
                                fechaInicio: '',
                                fechaFin: ''
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
                Actividades del Centro de Alumnos
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
