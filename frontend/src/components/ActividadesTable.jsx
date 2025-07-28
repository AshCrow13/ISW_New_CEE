import { useState } from 'react';
import { 
    Box, 
    Typography,
    Chip
} from '@mui/material';
import { 
    Edit as EditIcon,
    Delete as DeleteIcon,
    CalendarToday as CalendarTodayIcon,
    LocationOn as LocationOnIcon,
    FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import DataTable from '@components/common/DataTable';
// ...existing code...
import ActionButton from '@components/common/ActionButton';

// Styled components
const CategoriaChip = styled(Chip)(({ theme, variant }) => {
    const getColor = () => {
        switch (variant) {
            case 'Deportivo': return theme.palette.success.main;
            case 'Recreativo': return theme.palette.info.main;
            case 'Oficial': return theme.palette.error.main;
            default: return theme.palette.grey[500];
        }
    };

    return {
        backgroundColor: getColor(),
        color: theme.palette.getContrastText(getColor()),
        fontWeight: 500,
        fontSize: '0.75rem',
    };
});

const FechaBox = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
}));

const ActividadesTable = ({ 
    actividades, 
    onEdit, 
    onDelete, 
    onDownloadDocumento,
    userRole 
}) => {
    const [filter, setFilter] = useState('');

    // Filtrar actividades
    const filteredActividades = actividades.filter(actividad =>
        actividad.titulo?.toLowerCase().includes(filter.toLowerCase()) ||
        actividad.descripcion?.toLowerCase().includes(filter.toLowerCase()) ||
        actividad.lugar?.toLowerCase().includes(filter.toLowerCase()) ||
        actividad.categoria?.toLowerCase().includes(filter.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            fecha: date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            hora: date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const renderActividad = (actividad) => {
        return (
            <Box>
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    {actividad.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {actividad.descripcion}
                </Typography>
            </Box>
        );
    };

    const renderFechaHora = (actividad) => {
        const { fecha, hora } = formatDate(actividad.fecha);
        return (
            <FechaBox>
                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <CalendarTodayIcon fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight={500}>
                        {fecha}
                    </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    {hora}
                </Typography>
            </FechaBox>
        );
    };

    const renderLugar = (lugar) => {
        return (
            <Box display="flex" alignItems="center" gap={0.5}>
                <LocationOnIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight={500}>
                    {lugar}
                </Typography>
            </Box>
        );
    };

    const renderCategoria = (categoria) => {
        return (
            <CategoriaChip
                variant={categoria}
                label={categoria}
                size="small"
            />
        );
    };

    const renderActions = (actividad) => {
        const canEdit = userRole === 'admin' || userRole === 'vocalia';
        
        return (
            <Box display="flex" gap={1}>
                {/* Botón de descarga si tiene documento */}
                {actividad.documentos && actividad.documentos.length > 0 && (
                    <ActionButton
                        variant="info"
                        tooltip="Descargar documento"
                        onClick={() => onDownloadDocumento(actividad.documentos[0].id, actividad.documentos[0].titulo)}
                    >
                        <FileDownloadIcon fontSize="small" />
                    </ActionButton>
                )}
                
                {/* Botones de administración */}
                {canEdit && (
                    <>
                        <ActionButton
                            variant="edit"
                            tooltip="Editar actividad"
                            onClick={() => onEdit(actividad)}
                        >
                            <EditIcon fontSize="small" />
                        </ActionButton>
                        <ActionButton
                            variant="delete"
                            tooltip="Eliminar actividad"
                            onClick={() => onDelete(actividad.id)}
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
            id: 'actividad',
            label: 'Actividad',
            minWidth: 300,
            sortable: false,
            render: (_, row) => renderActividad(row),
        },
        {
            id: 'fecha',
            label: 'Fecha y Hora',
            minWidth: 140,
            render: (_, row) => renderFechaHora(row),
        },
        {
            id: 'lugar',
            label: 'Lugar',
            minWidth: 160,
            render: (value) => renderLugar(value),
        },
        {
            id: 'categoria',
            label: 'Categoría',
            minWidth: 120,
            render: (value) => renderCategoria(value),
        },
        {
            id: 'acciones',
            label: 'Acciones',
            minWidth: 160,
            sortable: false,
            render: (_, row) => renderActions(row),
        },
    ];


    return (
        <DataTable
            data={filteredActividades}
            columns={columns}
            searchable={true}
            searchPlaceholder="Buscar actividad por título, descripción, lugar o categoría..."
            searchValue={filter}
            onSearchChange={setFilter}
            emptyStateText="No se encontraron actividades"
            emptyStateIcon="🎯"
            sortable={true}
        />
    );
};

export default ActividadesTable;
