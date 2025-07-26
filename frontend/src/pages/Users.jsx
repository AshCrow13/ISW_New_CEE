/*
import Table from '@components/Table';
import Search from '../components/Search';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser'; 
*/
import '@styles/users.css';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, TextField, Paper, Card, CardContent, Avatar, Divider, InputAdornment } from '@mui/material';
import { useCallback, useState, useMemo, useEffect } from 'react';
import useUsers from '@hooks/users/useGetUsers.jsx';
import Popup from '../components/Popup';
import { useAuth } from '@context/AuthContext';
import { getUsers, getStaffUsers } from '@services/user.service.js';
import useEditUser from '@hooks/users/useEditUser.jsx';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [staffUsers, setStaffUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filterTerm, setFilterTerm] = useState('');
  const { user } = useAuth();
  const userRole = user?.rol;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Hook de edición
  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen: isEditPopupOpen,
    setIsPopupOpen: setIsEditPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

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

  // Filtrar los usuarios staff por el término de búsqueda
  const filteredStaffUsers = useMemo(() => {
    if (!filterTerm.trim()) return staffUsers;
    
    return staffUsers.filter(user => 
      user.nombreCompleto?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.rut?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.rol?.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [staffUsers, filterTerm]);

  // Filtrar todos los usuarios por el término de búsqueda
  const filteredUsers = useMemo(() => {
    if (!filterTerm.trim()) {
      // Solo staff por defecto
      return allUsers.filter(user => user.rol === 'admin' || user.rol === 'vocalia');
    }
    // Todos los usuarios al buscar
    return allUsers.filter(user =>
      user.nombreCompleto?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.rut?.toLowerCase().includes(filterTerm.toLowerCase()) ||
      user.rol?.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [allUsers, filterTerm]);

  // Abrir el modal de edición para admin
  const handleEditUser = (userData) => {
    setDataUser([userData]);
    setSelectedRow(userData);
    setIsEditPopupOpen(true);
  };

  // Renderizar la vista de tarjetas para todos los roles
  const renderCardView = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Directivos del Centro de Estudiantes</Typography>
      
      {/* Campo de búsqueda solo visible para admin y vocalia */}
      {(userRole === 'admin' || userRole === 'vocalia') && (
        <TextField
          label="Buscar directivo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          sx={{ mb: 4, maxWidth: 500 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {filteredUsers.map((user) => (
          <Card key={user.id} sx={{ 
            boxShadow: 2, 
            transition: 'transform 0.2s', 
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } 
          }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mb: 2,
                  bgcolor: user.rol === 'admin' ? 'primary.main' : 'secondary.main',
                  fontSize: '2rem'
                }}
              >
                {user.nombreCompleto.charAt(0)}
              </Avatar>
              
              <Typography variant="h6" align="center" gutterBottom>
                {user.nombreCompleto}
              </Typography>
              
              <Typography 
                variant="caption" 
                align="center" 
                sx={{ 
                  bgcolor: user.rol === 'admin' ? 'primary.light' : 'secondary.light',
                  color: user.rol === 'admin' ? 'primary.contrastText' : 'secondary.contrastText',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  mb: 2,
                  fontWeight: 'bold'
                }}
              >
                {user.rol === 'admin'
                  ? 'Administrador'
                  : user.rol === 'vocalia'
                    ? 'Vocalía'
                    : 'Estudiante'}
              </Typography>
              
              <Divider sx={{ width: '100%', my: 1.5 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', mb: 1 }}>
                <EmailIcon color="action" fontSize="small" />
                <Typography variant="body2">{user.email}</Typography>
              </Box>
              
              {/* Botón de editar solo para administradores */}
              {userRole === 'admin' && (
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleEditUser(user)}
                >
                  Editar usuario
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* Mensaje si no hay resultados */}
      {filteredUsers.length === 0 && (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center', 
          bgcolor: '#f5f5f5', 
          borderRadius: 2, 
          mt: 3 
        }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron directivos
          </Typography>
          {filterTerm && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Intenta con otro término de búsqueda
            </Typography>
          )}
        </Box>
      )}
      
      {/* Popup para editar usuario (solo visible para admin) */}
      {userRole === 'admin' && (
        <Popup
          show={isEditPopupOpen}
          setShow={setIsEditPopupOpen}
          data={dataUser}
          action={handleUpdate}
        />
      )}
    </Box>
  );

  return renderCardView();
};

export default Users;
