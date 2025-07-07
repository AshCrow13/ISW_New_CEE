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

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [filterRut, setFilterRut] = useState('');
  const { user } = useAuth();
  const userRole = user?.rol;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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
                  setSelectedRow(params.row);
                  setIsPopupOpen(true);
                }}
              >
                Editar
              </Button>
              {/* Puedes agregar un boton */}
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
          show={isPopupOpen}
          setShow={setIsPopupOpen}
          data={selectedRow ? [selectedRow] : []}
          action={() => {/* Implementar edicion */}}
        />
      )}
    </Box>
  );
};

export default Users;
