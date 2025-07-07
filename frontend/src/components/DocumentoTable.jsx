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
        field: "urlArchivo",
        headerName: "Archivo",
        flex: 1,
        renderCell: (params) => {
            const url = params.row.urlArchivo;
            if (url && url.trim() !== "") {
                // Extraer el nombre del archivo de la URL
                const filename = url.split("/").pop();
                return (
                <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    }}
                >
                    <span>📎 {filename}</span>
                </div>
                );
            }
            return <span style={{ color: "#666" }}>Sin archivo</span>;
        },
        sortable: false,
        filterable: false,
        },
        {
        field: "fechaSubida",
        headerName: "Fecha",
        flex: 1,
        renderCell: (params) => {
            const fecha = new Date(params.row.fechaSubida);
            return fecha.toLocaleDateString("es-ES");
        },
        },
        ...(userRole === "admin" || userRole === "vocalia"
        ? [
            {
                field: "acciones",
                headerName: "Acciones",
                flex: 1,
                renderCell: (params) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    {params.row.urlArchivo && (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onDownload(params.row.id)}
                    >
                        📥 Descargar
                    </Button>
                    )}
                    {userRole === "admin" && (
                    <>
                        <Button
                        size="small"
                        onClick={() => onEdit(params.row)}
                        >
                        ✏️ Editar
                        </Button>
                        <Button
                        size="small"
                        color="error"
                        onClick={() => onDelete(params.row.id)}
                        >
                        🗑️ Eliminar
                        </Button>
                    </>
                    )}
                </div>
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


