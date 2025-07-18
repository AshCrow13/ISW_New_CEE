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
import { Box, Typography, Button, Stack, TextField } from '@mui/material';
import { useCallback, useState, useMemo } from 'react';
import useUsers from '@hooks/users/useGetUsers.jsx';
import Popup from '../components/Popup';
import { useAuth } from '@context/AuthContext';
import { getUsers } from '@services/user.service.js';
import useEditUser from '@hooks/users/useEditUser.jsx';

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [filterRut, setFilterRut] = useState('');
  const { user } = useAuth();
  const userRole = user?.rol;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // ✅ USAR: Hook de edición
  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen: isEditPopupOpen,
    setIsPopupOpen: setIsEditPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

  // Mapea los datos de usuarios a filas
  const rows = useMemo(() => users.map((u, i) => ({
    id: u.id || i, // tener un id único
    ...u
  })), [users]);

  // Define columnas para DataGrid
  const columns = [
    { field: "nombreCompleto", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Correo electrónico", flex: 1 },
    { field: "rut", headerName: "Rut", flex: 0.7 },
    { field: "rol", headerName: "Rol", flex: 0.6 },
    { field: "createdAt", headerName: "Creado", flex: 1 },
    // Si el usuario es admin, muestra la columna de acciones
    ...(userRole === 'admin'
      ? [
        {
          field: 'acciones',
          headerName: 'Acciones',
          sortable: false,
          renderCell: (params) => (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => {
                  console.log('🔄 Usuario seleccionado para editar:', params.row); // ✅ DEBUG
                  
                  // ✅ CORREGIR: Establecer datos del usuario ANTES de abrir el popup
                  setDataUser([params.row]); // Pasar usuario al hook
                  setSelectedRow(params.row); // Mantener referencia local
                  setIsEditPopupOpen(true); // Abrir popup
                }}
              >
                Editar
              </Button>
              {/* Puedes agregar un botón de eliminar aquí */}
            </Stack>
          ),
          flex: 1
        }
      ] : [])
  ];

  // Filtrado por rut
  const filteredRows = useMemo(
    () =>
      filterRut
        ? rows.filter((r) => r.rut.toLowerCase().includes(filterRut.toLowerCase()))
        : rows,
    [rows, filterRut]
  );

  // ✅ MANEJAR: Selección de fila para editar
  const handleRowSelection = (user) => {
    setDataUser([user]); // Enviar usuario seleccionado al hook
    setSelectedRow(user);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Usuarios</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Filtrar por rut"
          value={filterRut}
          onChange={e => setFilterRut(e.target.value)}
          size="small"
        />
      </Stack>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8]}
          disableRowSelectionOnClick
        />
      </Box>
      {/* Popup solo para admin */}
      {userRole === 'admin' && (
        <Popup
          show={isEditPopupOpen}
          setShow={setIsEditPopupOpen}
          data={dataUser} // Datos del usuario seleccionado
          action={handleUpdate} // ✅ FUNCIÓN: Para ejecutar la actualización
        />
      )}
    </Box>
  );
};

export default Users;
