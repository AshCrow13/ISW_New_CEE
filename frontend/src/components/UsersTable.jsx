import { useState } from 'react';
import { 
    Box, 
    Typography
} from '@mui/material';
import { 
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import DataTable from '@components/common/DataTable';
import StatusChip from '@components/common/StatusChip';
import ActionButton from '@components/common/ActionButton';

const UserAvatar = styled(Box)(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    fontSize: '1rem',
    marginRight: theme.spacing(2),
}));

const UsersTable = ({ users, onEdit, onDelete, searchValue = "", onSearchChange = () => {} }) => {
    const [filter, setFilter] = useState(searchValue);

    // Filtrar usuarios
    const filteredUsers = users.filter(user =>
        user.nombreCompleto?.toLowerCase().includes(filter.toLowerCase()) ||
        user.email?.toLowerCase().includes(filter.toLowerCase()) ||
        user.rut?.toLowerCase().includes(filter.toLowerCase()) ||
        user.rol?.toLowerCase().includes(filter.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const getUserInitials = (name) => {
        if (!name) return '?';
        return name.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const renderUserInfo = (user) => {
        return (
            <Box display="flex" alignItems="center">
                <UserAvatar>
                    {getUserInitials(user.nombreCompleto)}
                </UserAvatar>
                <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                        {user.nombreCompleto}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {user.email}
                    </Typography>
                </Box>
            </Box>
        );
    };

    const renderActions = (user) => {
        return (
            <Box display="flex" gap={1}>
                <ActionButton 
                    variant="edit"
                    tooltip="Editar usuario"
                    onClick={() => onEdit(user)}
                >
                    <EditIcon fontSize="small" />
                </ActionButton>
                <ActionButton 
                    variant="delete"
                    tooltip="Eliminar usuario"
                    onClick={() => onDelete(user)}
                >
                    <DeleteIcon fontSize="small" />
                </ActionButton>
            </Box>
        );
    };

    // Definir columnas para la DataTable
    const columns = [
        {
            id: 'user',
            label: 'Usuario',
            minWidth: 280,
            sortable: false,
            render: (_, row) => renderUserInfo(row),
        },
        {
            id: 'rut',
            label: 'RUT',
            minWidth: 120,
            render: (value) => (
                <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
                    {value}
                </Typography>
            ),
        },
        {
            id: 'rol',
            label: 'Rol',
            minWidth: 120,
            render: (value) => (
                <StatusChip 
                    variant={value?.toLowerCase()} 
                    label={value} 
                    size="small" 
                />
            ),
        },
        {
            id: 'createdAt',
            label: 'Fecha Creación',
            minWidth: 160,
            render: (value) => (
                <Typography variant="body2" color="text.secondary">
                    {formatDate(value)}
                </Typography>
            ),
        },
        {
            id: 'acciones',
            label: 'Acciones',
            minWidth: 120,
            sortable: false,
            render: (_, row) => renderActions(row),
        },
    ];

    // Estadísticas para mostrar en la tabla
    const stats = [
        {
            label: 'usuarios totales',
            value: filteredUsers.length,
            icon: <PersonIcon />,
        },
        {
            label: 'administradores',
            value: filteredUsers.filter(u => u.rol === 'admin').length,
        },
        {
            label: 'estudiantes',
            value: filteredUsers.filter(u => u.rol === 'estudiante').length,
        },
    ];

    const handleSearchChange = (value) => {
        setFilter(value);
        onSearchChange(value);
    };

    return (
        <DataTable
            data={filteredUsers}
            columns={columns}
            searchable={true}
            searchPlaceholder="Buscar por nombre, email, RUT o rol..."
            searchValue={filter}
            onSearchChange={handleSearchChange}
            stats={stats}
            emptyStateText="No se encontraron usuarios"
            emptyStateIcon="👥"
            sortable={true}
        />
    );
};

export default UsersTable;
