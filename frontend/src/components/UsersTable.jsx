import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UsersTable = ({ users, onEdit, onDelete }) => {
    // Define tus columnas
    const columns = [
        { field: 'nombreCompleto', headerName: 'Nombre', flex: 1, minWidth: 180 },
        { field: 'email', headerName: 'Correo electrónico', flex: 1, minWidth: 200 },
        { field: 'rut', headerName: 'RUT', minWidth: 120 },
        { field: 'rol', headerName: 'Rol', minWidth: 120 },
        { field: 'createdAt', headerName: 'Fecha creación', minWidth: 160 },
        {
        field: 'actions',
        headerName: 'Acciones',
        minWidth: 120,
        sortable: false,
        renderCell: (params) => ( // Renderiza botones de acción
            <Box>
            <IconButton color="primary" onClick={() => onEdit(params.row)}>
                <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(params.row)}>
                <DeleteIcon />
            </IconButton>
            </Box>
        ),
        }
    ];

    // DataGrid espera id único por fila (usa id, rut, email, etc)
    const rows = users.map((u, i) => ({
        id: u.id || u.rut || u.email || i,
        ...u
    }));

    return (
        <Box sx={{ width: '100%', height: 480, backgroundColor: '#fff', borderRadius: 2, boxShadow: 2, mt: 2 }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8, 16, 24]}
            disableSelectionOnClick
            autoHeight
            sx={{
            '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#003366',
                color: '#fff'
            }
            }}
        />
        </Box>
    );
};

export default UsersTable;
