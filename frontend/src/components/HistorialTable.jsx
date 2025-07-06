import Table from '@components/Table';

const columns = [ // Definición de columnas para la tabla
    { title: "Fecha y hora", field: "fecha", formatter: row => new Date(row.fecha).toLocaleString() },
    { title: "Acción", field: "accion" },
    { title: "Recurso", field: "recurso" },
    { title: "Usuario responsable", field: "usuario", formatter: row => row.usuario?.nombre || 'Desconocido' },
    { title: "Detalles", field: "detalles" },
];

const HistorialTable = ({ historial = [] }) => ( // Componente para mostrar el historial en una tabla
    <Table data={historial} columns={columns} />
);

export default HistorialTable;
