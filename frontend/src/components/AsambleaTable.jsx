import { useState } from 'react';
import { 
    Box, 
    Chip, 
    Typography,
    Button,
    Tooltip
} from '@mui/material';
import { 
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
    Group as GroupIcon,
    Lock as LockIcon,
    LockOpen as UnlockIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import DataTable from '@components/common/DataTable';
import StatusChip from '@components/common/StatusChip';
import ActionButton from '@components/common/ActionButton';
import AsistenciaForm from '@components/AsistenciaForm';
import AsistenciasList from '@components/AsistenciasList';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';

// Styled components
const SalaChip = styled(Chip)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.grey[100]} 100%)`,
    color: theme.palette.primary.main,
    fontWeight: 500,
    border: `1px solid ${theme.palette.grey[300]}`,
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}));

const ClaveBox = styled(Box)(({ theme }) => ({
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    fontFamily: 'Courier New, monospace',
    background: theme.palette.grey[50],
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.75),
    border: `1px solid ${theme.palette.grey[200]}`,
    marginTop: theme.spacing(0.5),
}));

const AsambleaTable = ({ asambleas, onEdit, onDelete, userRole }) => {
    const [filter, setFilter] = useState('');
    const [mostrarAsistenciaForm, setMostrarAsistenciaForm] = useState(false);
    const [mostrarAsistenciasList, setMostrarAsistenciasList] = useState(false);
    const [asambleaSeleccionada, setAsambleaSeleccionada] = useState(null);

    // Filtrar asambleas
    const filteredAsambleas = asambleas.filter(asamblea =>
        asamblea.Temas?.toLowerCase().includes(filter.toLowerCase()) ||
        asamblea.Sala?.toLowerCase().includes(filter.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (asamblea) => {
        const now = new Date();
        const asambleaDate = new Date(asamblea.Fecha);
        
        if (asambleaDate < now) {
            return <StatusChip variant="completed" label="Finalizada" size="small" />;
        } else if (asambleaDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
            return <StatusChip variant="upcoming" label="Próxima" size="small" />;
        } else {
            return <StatusChip variant="scheduled" label="Programada" size="small" />;
        }
    };

    const getAsistenciaStatus = (asamblea) => {
        return (
            <Box>
                <StatusChip 
                    variant={asamblea.AsistenciaAbierta ? 'open' : 'closed'}
                    label={asamblea.AsistenciaAbierta ? 'Abierta' : 'Cerrada'}
                    size="small"
                />
                {asamblea.ClaveAsistencia && (userRole === 'admin' || userRole === 'vocalia') && (
                    <ClaveBox>
                        Clave: {asamblea.ClaveAsistencia}
                    </ClaveBox>
                )}
            </Box>
        );
    };

    const renderActions = (asamblea) => {
        return (
            <Box display="flex" gap={1}>
                {/* Botón de registrar asistencia - visible para todos los usuarios */}
                {asamblea.AsistenciaAbierta && (
                    <ActionButton 
                        variant="asistencia"
                        tooltip="Registrar asistencia"
                        onClick={() => handleRegistrarAsistencia(asamblea)}
                    >
                        <CheckIcon fontSize="small" />
                    </ActionButton>
                )}
                
                {/* Botón de ver asistencias - solo para admin y vocalía */}
                {(userRole === 'admin' || userRole === 'vocalia') && (
                    <ActionButton 
                        variant="list"
                        tooltip="Ver asistencias"
                        onClick={() => handleVerAsistencias(asamblea)}
                    >
                        <GroupIcon fontSize="small" />
                    </ActionButton>
                )}
                
                {/* Botones de administración - solo para admin y vocalía */}
                {(userRole === 'admin' || userRole === 'vocalia') && (
                    <>
                        <ActionButton 
                            variant="edit"
                            tooltip={asamblea.AsistenciaAbierta ? "Cerrar asistencia" : "Abrir asistencia"}
                            onClick={() => onEdit(asamblea)}
                        >
                            {asamblea.AsistenciaAbierta ? <LockIcon fontSize="small" /> : <UnlockIcon fontSize="small" />}
                        </ActionButton>
                        <ActionButton 
                            variant="delete"
                            tooltip="Eliminar asamblea"
                            onClick={() => handleDelete(asamblea.id)}
                        >
                            <DeleteIcon fontSize="small" />
                        </ActionButton>
                    </>
                )}
            </Box>
        );
    };

    // Definir columnas para la DataTable
    const columns = [
        {
            id: 'Temas',
            label: 'Tema',
            minWidth: 250,
            maxWidth: 300,
            render: (value) => (
                <Box>
                    <Tooltip title={value} arrow placement="top">
                        <Typography 
                            variant="subtitle2" 
                            fontWeight={600} 
                            color="text.primary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '280px'
                            }}
                        >
                            {value}
                        </Typography>
                    </Tooltip>
                </Box>
            ),
        },
        {
            id: 'Fecha',
            label: 'Fecha y Hora',
            minWidth: 200,
            render: (value) => (
                <Typography variant="body2" color="text.primary" fontWeight={500}>
                    {formatDate(value)}
                </Typography>
            ),
        },
        {
            id: 'Sala',
            label: 'Sala',
            minWidth: 120,
            maxWidth: 120,
            render: (value) => (
                <Tooltip title={value} arrow placement="top">
                    <SalaChip label={value} size="small" />
                </Tooltip>
            ),
        },
        {
            id: 'estado',
            label: 'Estado',
            minWidth: 120,
            sortable: false,
            render: (_, row) => getStatusBadge(row),
        },
        {
            id: 'asistencia',
            label: 'Asistencia',
            minWidth: 140,
            sortable: false,
            render: (_, row) => getAsistenciaStatus(row),
        },
        {
            id: 'acciones',
            label: 'Acciones',
            minWidth: 160,
            maxWidth: 160,
            sortable: false,
            render: (_, row) => renderActions(row),
        },
    ];

    const handleDelete = async (id) => {
        try {
            await onDelete(id);
        } catch (error) {
            showErrorAlert('Error', 'No se pudo eliminar la asamblea');
        }
    };

    const handleRegistrarAsistencia = (asamblea) => {
        setAsambleaSeleccionada(asamblea);
        setMostrarAsistenciaForm(true);
    };

    const handleVerAsistencias = (asamblea) => {
        setAsambleaSeleccionada(asamblea);
        setMostrarAsistenciasList(true);
    };

    const handleCloseAsistenciaForm = () => {
        setMostrarAsistenciaForm(false);
        setAsambleaSeleccionada(null);
    };

    const handleCloseAsistenciasList = () => {
        setMostrarAsistenciasList(false);
        setAsambleaSeleccionada(null);
    };

    const handleAsistenciaSuccess = () => {
        // Aquí podrías actualizar la lista de asambleas si es necesario
        showSuccessAlert('Éxito', 'Asistencia registrada correctamente');
    };

    // Estadísticas para mostrar en la tabla
    const stats = [
        {
            label: 'asambleas',
            value: filteredAsambleas.length,
        },
    ];

    return (
        <Box>
            <DataTable
                data={filteredAsambleas}
                columns={columns}
                searchable={true}
                searchPlaceholder="Buscar asamblea por tema o sala..."
                searchValue={filter}
                onSearchChange={setFilter}
                stats={stats}
                emptyStateText="No se encontraron asambleas"
                emptyStateIcon="📋"
                sortable={true}
            />

            {/* Modal de registro de asistencia */}
            {mostrarAsistenciaForm && asambleaSeleccionada && (
                <AsistenciaForm
                    asamblea={asambleaSeleccionada}
                    onClose={handleCloseAsistenciaForm}
                    onSuccess={handleAsistenciaSuccess}
                />
            )}

            {/* Modal de lista de asistencias */}
            {mostrarAsistenciasList && asambleaSeleccionada && (
                <AsistenciasList
                    asamblea={asambleaSeleccionada}
                    onClose={handleCloseAsistenciasList}
                />
            )}
        </Box>
    );
};

export default AsambleaTable; 