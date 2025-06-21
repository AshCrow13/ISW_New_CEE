// Tabla con lista de actividades
/*
import Table from './Table';
import Search from './Search';
import { useState } from 'react';

const ActivityTable = ({ activities, onEdit, onDelete }) => {
    const [filter, setFilter] = useState('');
    const columns = [
        { title: "Título", field: "titulo" },
        { title: "Descripción", field: "descripcion" },
        { title: "Fecha", field: "fecha" },
        { title: "Lugar", field: "lugar" },
        { title: "Categoría", field: "categoria" },
        { title: "Responsable", field: "responsable" },
        // Agregar botones para editar/eliminar según permisos del usuario
    ];

    return (
        <div>
            <Search value={filter} onChange={e => setFilter(e.target.value)} placeholder="Buscar actividad..." />
            <Table
                data={activities}
                columns={columns}
                filter={filter}
                dataToFilter="titulo"
                initialSortName="fecha"
            />
            {} // agregar en {} botones para crear una nueva actividad ****
        </div>
    );
};

export default ActivityTable;
*/