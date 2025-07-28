import { useContext, useState } from 'react';
import { AuthContext } from '@context/AuthContext.jsx';
import FormularioCrearVotacion from '@components/votacion/VotacionFormularioCrear.jsx';
import VotacionTabla from '@components/votacion/VotacionTabla.jsx';
import VotacionDetalleNuevo from '@components/votacion/VotacionDetalleNuevo.jsx';
import VotacionEditar from '@components/votacion/VotacionEditar.jsx';
import VotacionHeader from '@components/votacion/VotacionHeader.jsx';
import useVotaciones from '@hooks/votacion/useVotaciones.jsx';
import { Container, Paper, Typography, Box, Fade, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { 
    HowToVote as HowToVoteIcon,
    Add as AddIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import PageContainer from '@components/common/PageContainer';
import PageHeader from '@components/common/PageHeader';

const Votacion = () => {
    const { user } = useContext(AuthContext);
    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const {
        view,
        setView,
        votaciones,
        votacionSeleccionada,
        loading,
        verDetalle,
        irAEditar,
        handleEliminar,
        handleActualizar,
        handleCrearVotacion,
        handleVotar,
        volverAlMenu
    } = useVotaciones();

    const getStatsData = () => {
        return [
            {
                label: 'votaciones totales',
                value: votaciones?.length || 0,
                icon: <HowToVoteIcon />,
            },
            {
                label: 'activas',
                value: votaciones?.filter(v => v.estado === true).length || 0,
            },
            {
                label: 'cerradas',
                value: votaciones?.filter(v => v.estado === false).length || 0,
            },
        ];
    };

    const handleCrearVotacionSuccess = () => {
        setModalCrearOpen(false);
        // Aquí puedes agregar lógica adicional como refrescar la lista
    };

    const handleCrearVotacionSubmit = (data) => {
        handleCrearVotacion(data);
        setModalCrearOpen(false);
    };

    const renderMainContent = () => {
        switch (view) {
            case 'detalle':
                return (
                    <VotacionDetalleNuevo
                        votacionSeleccionada={votacionSeleccionada}
                        loading={loading}
                        user={user}
                        onVolver={volverAlMenu}
                        handleVotar={handleVotar}
                    />
                );
            case 'editar':
                return (
                    <VotacionEditar
                        votacion={votacionSeleccionada}
                        onVolver={volverAlMenu}
                        onGuardar={handleActualizar}
                        loading={loading}
                    />
                );
            default: // tabla
                return (
                    <>
                        <PageHeader
                            title="Centro de Votaciones"
                            subtitle="Gestiona y participa en las votaciones del centro de estudiantes"
                            icon={<HowToVoteIcon />}
                            breadcrumbs={[
                                { label: 'Inicio', href: '/home' },
                                { label: 'Votaciones' }
                            ]}
                            stats={getStatsData()}
                            actions={
                                (user?.rol === 'admin' || user?.rol === 'vocalia') 
                                    ? [{
                                        label: 'Nueva Votación',
                                        icon: <AddIcon />,
                                        props: {
                                            variant: 'contained',
                                            onClick: () => setModalCrearOpen(true),
                                        },
                                    }]
                                    : []
                            }
                        />
                        <VotacionTabla
                            votaciones={votaciones}
                            loading={loading}
                            user={user}
                            onVerDetalle={verDetalle}
                            onEditar={irAEditar}
                            onEliminar={handleEliminar}
                        />
                    </>
                );
        }
    };

    return (
        <PageContainer>
            <Fade in={true}>
                <Box>
                    {renderMainContent()}
                </Box>
            </Fade>

            {/* Modal para crear nueva votación */}
            <Dialog 
                open={modalCrearOpen} 
                onClose={() => setModalCrearOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxHeight: '90vh',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none'
                    }
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, backgroundColor: 'transparent' }}>
                    <FormularioCrearVotacion
                        onSubmit={handleCrearVotacionSubmit}
                        onSuccess={handleCrearVotacionSuccess}
                        onCancel={() => setModalCrearOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
};

export default Votacion;
