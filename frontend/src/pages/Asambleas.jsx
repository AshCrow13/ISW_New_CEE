import { useState, useEffect } from 'react';
import { getAsambleas, createAsamblea, updateAsamblea, deleteAsamblea } from '@services/asamblea.service.js';
import AsambleaTable from '@components/AsambleaTable';
import AsambleaForm from '@components/AsambleaForm';
import PageContainer from '@components/common/PageContainer';
import PageHeader from '@components/common/PageHeader';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import { useAuth } from '@context/AuthContext';
import { Button, CircularProgress, Box } from '@mui/material';
import { Add as AddIcon, Description as DescriptionIcon, ListAlt as ListAltIcon } from '@mui/icons-material';

const Asambleas = () => {
    const [asambleas, setAsambleas] = useState([]);
    const [todasAsambleas, setTodasAsambleas] = useState([]);
    const [proximasAsambleas, setProximasAsambleas] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verTodas, setVerTodas] = useState(false);
    const { user } = useAuth();

// Cargar asambleas
    useEffect(() => {
        fetchAsambleas();
    }, []);

    // Actualizar vista cuando cambia el filtro
    useEffect(() => {
        if (verTodas) {
            setAsambleas(todasAsambleas);
        } else {
            setAsambleas(proximasAsambleas);
        }
    }, [verTodas, todasAsambleas, proximasAsambleas]);

    const fetchAsambleas = async () => {
        try {
            setLoading(true);
            const res = await getAsambleas();
            setTodasAsambleas(res);
            
            // Filtrar próximas asambleas (no finalizadas)
            const ahora = new Date();
            const proximas = res.filter(asamblea => {
                const fechaAsamblea = new Date(asamblea.Fecha);
                return fechaAsamblea >= ahora;
            });
            setProximasAsambleas(proximas);
            
            // Establecer vista inicial según preferencia
            if (!verTodas) {
                setAsambleas(proximas);
            } else {
                setAsambleas(res);
            }
        } catch (error) {
            showErrorAlert('Error', 'No se pudieron cargar las asambleas');
        } finally {
            setLoading(false);
        }
    };



    const handleEditar = async (asamblea) => {
        try {
            setLoading(true);
            const nuevoEstado = !asamblea.AsistenciaAbierta;
            await updateAsamblea(asamblea.id, { AsistenciaAbierta: nuevoEstado });
            showSuccessAlert(
                nuevoEstado ? 'Asistencia Abierta' : 'Asistencia Cerrada', 
                `La asistencia ha sido ${nuevoEstado ? 'abierta' : 'cerrada'} correctamente`
            );
            fetchAsambleas();
        } catch (e) {
            showErrorAlert('Error', e.message || 'Ocurrió un error al cambiar el estado de asistencia');
        } finally {
            setLoading(false);
        }
    };

    const handleCrear = () => {
        setFormData({}); // Formulario vacío
        setMostrarForm(true);
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar esta asamblea?")) {
            try {
                setLoading(true);
                await deleteAsamblea(id);
                showSuccessAlert('Eliminada', 'La asamblea fue eliminada correctamente');
                fetchAsambleas();
            } catch (e) {
                showErrorAlert('Error', e.message || 'Ocurrió un error al eliminar la asamblea');
            } finally {
                setLoading(false);
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (formData?.id) { // Si hay id
                await updateAsamblea(formData.id, data);
                showSuccessAlert('Editada', 'Asamblea editada con éxito');
            } else { // Si no hay id
                await createAsamblea(data);
                showSuccessAlert('Creada', 'Asamblea creada con éxito');
            }
            setMostrarForm(false);
            setFormData(null);
            fetchAsambleas();
        } catch (e) {
            showErrorAlert('Error', e.message || 'Ocurrió un error al procesar la asamblea');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelForm = () => {
        setMostrarForm(false);
        setFormData(null);
    };

    return (
        <PageContainer>
            <PageHeader
                title="Gestión de Asambleas"
                subtitle="Administra las asambleas estudiantiles y sus configuraciones"
                icon={<DescriptionIcon />}
                breadcrumbs={[
                    { label: 'Inicio', href: '/home' },
                    { label: 'Asambleas' }
                ]}
                stats={[
                    {
                        label: !verTodas ? 'próximas asambleas' : 'asambleas totales',
                        value: asambleas.length,
                        icon: <DescriptionIcon />,
                    },
                    {
                        label: 'finalizadas',
                        value: todasAsambleas.length - proximasAsambleas.length,
                    }
                ]}
                actions={[
                    // Botón para alternar vista - disponible para todos los usuarios
                    {
                        label: verTodas ? 'Ver Próximas' : 'Ver Todas',
                        icon: <ListAltIcon />,
                        props: {
                            variant: 'outlined',
                            onClick: () => setVerTodas(!verTodas),
                        },
                    },
                    // Botón para admin/vocalia - crear asamblea
                    ...(user?.rol === 'admin' || user?.rol === 'vocalia' ? [{
                        label: 'Nueva Asamblea',
                        icon: <AddIcon />,
                        props: {
                            variant: 'contained',
                            onClick: handleCrear,
                            disabled: loading,
                        },
                    }] : [])
                ]}
            />

            {loading && asambleas.length === 0 ? (
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="400px"
                    flexDirection="column"
                    gap={2}
                >
                    <CircularProgress size={48} />
                    <Box>Cargando asambleas...</Box>
                </Box>
            ) : (
                <AsambleaTable
                    asambleas={asambleas}
                    onEdit={handleEditar}
                    onDelete={handleEliminar}
                    userRole={user?.rol}
                />
            )}

            {mostrarForm && (
                <AsambleaForm
                    initialData={formData}
                    onSubmit={onSubmit}
                    onCancel={handleCancelForm}
                    isEditing={!!formData?.id}
                    loading={loading}
                />
            )}
        </PageContainer>
    );
};

export default Asambleas; 