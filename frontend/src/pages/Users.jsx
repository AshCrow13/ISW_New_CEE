import { useCallback, useState, useMemo, useEffect } from 'react';
import { 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Typography,
    Box
} from '@mui/material';
import { 
    Add as AddIcon, 
    People as PeopleIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import PageContainer from '@components/common/PageContainer';
import PageHeader from '@components/common/PageHeader';
import UsersTable from '@components/UsersTable';
import Popup from '@components/Popup';
import useUsers from '@hooks/users/useGetUsers.jsx';
import useEditUser from '@hooks/users/useEditUser.jsx';
import useDeleteUser from '@hooks/users/useDeleteUser.jsx';
import { useAuth } from '@context/AuthContext';
import { getUsers, getStaffUsers } from '@services/user.service.js';

// Styled components
const FormDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    minWidth: 500,
  },
}));

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [staffUsers, setStaffUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filterTerm, setFilterTerm] = useState('');
  const [showAllUsers, setShowAllUsers] = useState(false);
  const { user } = useAuth();
  const userRole = user?.rol;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Hook de edición
  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen: isEditPopupOpen,
    setIsPopupOpen: setIsEditPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

  // Hook de eliminación
  const { handleDelete } = useDeleteUser(fetchUsers, setDataUser);

  // Cargar usuarios staff (admin y vocalia)
  useEffect(() => {
    loadStaffUsers();
  }, []);

  // Cargar todos los usuarios
  useEffect(() => {
    loadAllUsers();
  }, []);

  // Función para cargar solo usuarios admin y vocalia
  const loadStaffUsers = async () => {
    try {
      const staffData = await getStaffUsers();
      setStaffUsers(staffData);
    } catch (error) {
      console.error('Error al cargar usuarios staff:', error);
    }
  };

  // Función para cargar todos los usuarios
  const loadAllUsers = async () => {
    try {
      const usersData = await getUsers();
      setAllUsers(usersData);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  // Determinar qué usuarios mostrar
  const displayUsers = useMemo(() => {
    const baseUsers = showAllUsers ? allUsers : staffUsers;
    
    if (!filterTerm.trim()) return baseUsers;
    
    return baseUsers.filter(user => 
      user.nombreCompleto?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.rut?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.rol?.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [allUsers, staffUsers, filterTerm, showAllUsers]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreateOpen(true);
  };

  const handleEditUser = (userData) => {
    // Siempre pasar como array para el hook y el Popup
    const arr = Array.isArray(userData) ? userData : [userData];
    setSelectedUser(arr);
    setDataUser(arr);
    handleClickUpdate(arr);
  };


  const handleDeleteUser = (userData) => {
    // Siempre pasar como array para el hook
    const arr = Array.isArray(userData) ? userData : [userData];
    handleDelete(arr);
  };

  const handleToggleView = () => {
    setShowAllUsers(!showAllUsers);
    setFilterTerm(''); // Limpiar filtro al cambiar vista
  };

  const getStatsData = () => {
    const currentUsers = showAllUsers ? allUsers : staffUsers;
    return [
      {
        label: showAllUsers ? 'usuarios totales' : 'usuarios staff',
        value: displayUsers.length,
        icon: <PeopleIcon />,
      },
      {
        label: 'administradores',
        value: currentUsers.filter(u => u.rol === 'admin').length,
      },
      {
        label: 'estudiantes',
        value: currentUsers.filter(u => u.rol === 'estudiante').length,
      },
    ];
  };

  return (
    <PageContainer>
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios del sistema"
        icon={<PeopleIcon />}
        breadcrumbs={[
          { label: 'Inicio', href: '/home' },
          { label: 'Usuarios' }
        ]}
        stats={getStatsData()}
        actions={
          userRole !== 'estudiante'
            ? [
                {
                  label: showAllUsers ? 'Ver Solo Staff' : 'Ver Todos',
                  icon: <PeopleIcon />,
                  props: {
                    variant: 'outlined',
                    onClick: handleToggleView,
                  },
                },
              ]
            : []
        }
      />

      <UsersTable
        users={displayUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        searchValue={filterTerm}
        onSearchChange={userRole !== 'estudiante' ? setFilterTerm : undefined}
        searchable={userRole !== 'estudiante'}
        showAllUsers={showAllUsers}
        userRole={userRole}
      />

      {/* Modal de edición existente */}
      {isEditPopupOpen && (
        <Popup 
          show={isEditPopupOpen}
          setShow={setIsEditPopupOpen}
          data={dataUser}
          action={handleUpdate}
        />
      )}
    </PageContainer>
  );
};

export default Users;
