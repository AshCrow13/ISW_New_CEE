import ActividadForm from '@components/ActividadForm';
import ActividadesTable from '@components/ActividadesTable';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import { useState, useEffect } from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Paper,
    Chip,
    Divider,
    Avatar
} from '@mui/material';
import { 
    getActividades, 
    createActividad, 
    updateActividad, 
    deleteActividad,
    getProximasActividades
} from '@services/actividad.service.js';
import { downloadDocumento } from '@services/documento.service.js';
import { useAuth } from '@context/AuthContext';
import { 
    Event as EventIcon,
    Add as AddIcon,
    CalendarToday as CalendarTodayIcon,
    LocationOn as LocationOnIcon,
    ListAlt as ListAltIcon,
    FileDownload as FileDownloadIcon,
    Sports as SportsIcon,
    TheaterComedy as TheaterIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import PageContainer from '@components/common/PageContainer';
import PageHeader from '@components/common/PageHeader';

const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const [proximasActividades, setProximasActividades] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verTodas, setVerTodas] = useState(false);
    const { user } = useAuth();

    // Cargar actividades según la vista
    useEffect(() => {
        if (user?.rol === 'estudiante' && !verTodas) {
            fetchProximasActividades();
        } else {
            fetchActividades();
        }
    }, [user?.rol, verTodas]);

    // Fetch próximas actividades para estudiantes
    const fetchProximasActividades = async () => {
        setLoading(true);
        try {
            const res = await getProximasActividades(5); // Próximas 5 actividades
            setProximasActividades(res || []);
        } catch (e) {
            showErrorAlert('Error', 'No se pudieron cargar las próximas actividades');
            setProximasActividades([]);
        }
        setLoading(false);
    };

    // Fetch actividades
    const fetchActividades = async () => {
        setLoading(true);
        try {
            const res = await getActividades({ limit: 100 }); // Cargar todas las actividades
            setActividades(res || []);
        } catch (e) {
            showErrorAlert('Error', 'No se pudieron cargar las actividades');
            setActividades([]);
        }
        setLoading(false);
    };

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

    // Manejar edición
    const handleEdit = (actividad) => {
        setFormData(actividad);
        setFormOpen(true);
    };

    // Manejar eliminación
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
            try {
                await deleteActividad(id);
                showSuccessAlert('Eliminada', 'Actividad eliminada');
                fetchActividades();
            } catch (e) {
                showErrorAlert('Error', e.message || 'Ocurrió un error');
            }
        }
    };

    // Descargar documento asociado a actividad
    const handleDownloadDocumento = async (docId, titulo) => {
        try {
            const blob = await downloadDocumento(docId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = titulo || `documento_${docId}`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            showErrorAlert('Error', e.message || 'No se pudo descargar el archivo');
        }
    };

    // Vista para estudiantes - próximas actividades como cards
    const renderProximasActividades = () => {
        const getCategoryColor = (categoria) => {
            switch (categoria) {
                case 'Deportivo': return '#2e7d32'; // Verde
                case 'Recreativo': return '#1565c0'; // Azul
                case 'Oficial': return '#c62828'; // Rojo
                default: return '#616161'; // Gris por defecto
            }
        };
        
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
                <Typography variant="h5" mb={3}>Próximas Actividades</Typography>

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
                                <Grid item xs={12} sm={6} lg={4} key={actividad.id}>
                                    <Paper 
                                        elevation={2}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                elevation: 8,
                                                transform: 'translateY(-8px)',
                                                boxShadow: `0 12px 24px ${categoryColor}20`
                                            }
                                        }}
                                    >
                                        {/* Header con gradiente */}
                                        <Box 
                                            sx={{
                                                background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}DD 100%)`,
                                                color: 'white',
                                                p: 3,
                                                position: 'relative'
                                            }}
                                        >
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Avatar 
                                                    sx={{ 
                                                        bgcolor: 'rgba(255,255,255,0.2)', 
                                                        width: 48, 
                                                        height: 48,
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                >
                                                    {actividad.categoria === 'Deportivo' ? <SportsIcon /> : 
                                                     actividad.categoria === 'Recreativo' ? <TheaterIcon /> : <BusinessIcon />}
                                                </Avatar>
                                                <Chip 
                                                    label={actividad.categoria}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: 'rgba(255,255,255,0.25)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                                                {actividad.titulo}
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <CalendarTodayIcon fontSize="small" />
                                                <Typography variant="body2" fontWeight={500}>
                                                    {fecha} • {hora}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Contenido */}
                                        <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                sx={{ 
                                                    mb: 3,
                                                    flexGrow: 1,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {actividad.descripcion}
                                            </Typography>

                                            <Divider sx={{ mb: 2 }} />

                                            {/* Ubicación */}
                                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                <LocationOnIcon fontSize="small" sx={{ color: categoryColor }} />
                                                <Typography variant="body2" fontWeight={500}>
                                                    {actividad.lugar}
                                                </Typography>
                                            </Box>

                                            {/* Botón de descarga */}
                                            {actividad.documentos && actividad.documentos.length > 0 && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<FileDownloadIcon />}
                                                    onClick={() => handleDownloadDocumento(actividad.documentos[0].id, actividad.documentos[0].titulo)}
                                                    sx={{ 
                                                        mt: 'auto',
                                                        borderColor: categoryColor,
                                                        color: categoryColor,
                                                        '&:hover': {
                                                            bgcolor: `${categoryColor}10`,
                                                            borderColor: categoryColor
                                                        }
                                                    }}
                                                    fullWidth
                                                >
                                                    Descargar Documento
                                                </Button>
                                            )}
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        );
    };

    const getStatsData = () => {
        const isEstudianteView = user?.rol === 'estudiante' && !verTodas;
        const dataToUse = isEstudianteView ? proximasActividades : actividades;
        
        return [
            {
                label: isEstudianteView ? 'próximas actividades' : 'actividades totales',
                value: dataToUse.length,
                icon: <EventIcon />,
            },
            {
                label: 'deportivas',
                value: dataToUse.filter(a => a.categoria === 'Deportivo').length,
            },
            {
                label: 'recreativas',
                value: dataToUse.filter(a => a.categoria === 'Recreativo').length,
            },
            {
                label: 'oficiales',
                value: dataToUse.filter(a => a.categoria === 'Oficial').length,
            },
        ];
    };

    return (
        <PageContainer>
            <PageHeader
                title="Actividades del Centro de Alumnos"
                subtitle="Gestiona y participa en las actividades del centro de estudiantes"
                icon={<EventIcon />}
                breadcrumbs={[
                    { label: 'Inicio', href: '/home' },
                    { label: 'Actividades' }
                ]}
                stats={getStatsData()}
                actions={[
                    // Botón para ver todas las actividades (solo estudiantes en vista próximas)
                    ...(user?.rol === 'estudiante' && !verTodas ? [{
                        label: 'Ver Todas',
                        icon: <ListAltIcon />,
                        props: {
                            variant: 'outlined',
                            onClick: () => setVerTodas(true),
                        },
                    }] : []),
                    // Botón para volver a próximas actividades (solo estudiantes)
                    ...(user?.rol === 'estudiante' && verTodas ? [{
                        label: 'Ver Próximas',
                        icon: <EventIcon />,
                        props: {
                            variant: 'outlined',
                            onClick: () => setVerTodas(false),
                        },
                    }] : []),
                    // Botón de nueva actividad (solo admin/vocalia)
                    ...(user?.rol === 'admin' || user?.rol === 'vocalia' ? [{
                        label: 'Nueva Actividad',
                        icon: <AddIcon />,
                        props: {
                            variant: 'contained',
                            onClick: () => {
                                setFormData(null);
                                setFormOpen(true);
                            },
                        },
                    }] : [])
                ]}
            />

            {/* Mostrar vista según rol y estado */}
            {user?.rol === 'estudiante' && !verTodas 
                ? renderProximasActividades() 
                : (
                    <ActividadesTable
                        actividades={actividades}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDownloadDocumento={handleDownloadDocumento}
                        userRole={user?.rol}
                    />
                )
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
        </PageContainer>
    );
};

export default Actividades;
