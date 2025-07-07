import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Box } from "@mui/material";

const DocumentoTable = ({
    documentos = [],
    onEdit,
    onDelete,
    onDownload,
    userRole,
}) => {
  // Prepara las filas
    const rows = documentos.map((doc, idx) => ({
        id: doc.id || idx,
        ...doc,
    }));

    // Define columnas MUI DataGrid
    const columns = [
        { field: "titulo", headerName: "Título", flex: 1 },
        { field: "tipo", headerName: "Tipo", flex: 1 },
        {
        field: "archivo",
        headerName: "Archivo",
        flex: 1,
        renderCell: (params) =>
            params.row.archivo ? (
            <Button
                variant="outlined"
                size="small"
                onClick={() => onDownload(params.row.id)}
            >
                Descargar
            </Button>
            ) : (
            "Sin archivo"
            ),
        sortable: false,
        filterable: false,
        },
        ...(userRole === "admin" || userRole === "vocalia"
        ? [
            {
                field: "acciones",
                headerName: "Acciones",
                flex: 1,
                renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => onEdit(params.row)}
                    >
                    Editar
                    </Button>
                    <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => onDelete(params.row.id)}
                    >
                    Eliminar
                    </Button>
                </Stack>
                ),
                sortable: false,
                filterable: false,
            },
            ]
        : []),
    ];

    return (
        <Box sx={{ height: 500, width: "100%", my: 2 }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableRowSelectionOnClick
            autoHeight
        />
        </Box>
    );
};

export default DocumentoTable;


