import Table from '@components/Table';

const columns = [ // Definición de columnas para la tabla
    { title: "Título", field: "titulo" },
    { title: "Tipo", field: "tipo" },
    { title: "Archivo", field: "archivo", formatter: row =>
        row.archivo
            ? <a href="#" onClick={e => { e.preventDefault(); row.onDownload(row.id); }}>Descargar</a>
            : "Sin archivo"
    },
    { title: "Acciones", field: "acciones", formatter: row =>
        <>
            {row.onEdit && <button onClick={() => row.onEdit(row)}>Editar</button>}
            {row.onDelete && <button onClick={() => row.onDelete(row.id)}>Eliminar</button>}
        </>
    }
];

const DocumentoTable = ({ // Props para la tabla de documentos
    documentos = [],
    onEdit,
    onDelete,
    onDownload,
    userRole
    }) => {
    // datos con funciones
    const data = documentos.map(doc => ({
        ...doc,
        onEdit: (userRole === 'admin' || userRole === 'vocalia') ? onEdit : null,
        onDelete: (userRole === 'admin' || userRole === 'vocalia') ? onDelete : null,
        onDownload
    }));

    return ( // Renderiza la tabla con los datos y columnas definidas
        <Table
        data={data}
        columns={columns}
        />
    );
};

export default DocumentoTable;
