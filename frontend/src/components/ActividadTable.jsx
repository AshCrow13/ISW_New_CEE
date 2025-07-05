import Table from '@components/Table';
import Search from '@components/Search';
import { useState } from 'react';

const ActivityTable = ({ activities, onEdit, onDelete }) => { //arreglaaar
    const [filter, setFilter] = useState('');
    const columns = [
        { title: "Título", field: "titulo" },
        { title: "Descripción", field: "descripcion" },
        { title: "Fecha", field: "fecha" },
        { title: "Lugar", field: "lugar" },
        { title: "Categoría", field: "categoria" },
        { title: "Responsable", field: "responsable" },
        // Agregar botones para editar/eliminar según permisos del usuario****
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
            {// Renderizar botones de acción si se pasan las funciones onEdit y onDelete****

            } 
        </div>
    );
};

export default ActivityTable;