import { useState } from 'react';
import Search from '@components/Search';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import '@styles/asamblea.css';

const AsambleaTable = ({ asambleas, onEdit, onDelete, userRole }) => {
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState('Fecha');
    const [sortDirection, setSortDirection] = useState('desc');

    // Filtrar asambleas
    const filteredAsambleas = asambleas.filter(asamblea =>
        asamblea.Temas?.toLowerCase().includes(filter.toLowerCase()) ||
        asamblea.Sala?.toLowerCase().includes(filter.toLowerCase())
    );

    // Ordenar asambleas
    const sortedAsambleas = [...filteredAsambleas].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (sortField === 'Fecha') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else {
            aValue = aValue?.toString().toLowerCase();
            bValue = bValue?.toString().toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = async (id) => {
        try {
            await onDelete(id);
        } catch (error) {
            showErrorAlert('Error', 'No se pudo eliminar la asamblea');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (asamblea) => {
        const now = new Date();
        const asambleaDate = new Date(asamblea.Fecha);
        
        if (asambleaDate < now) {
            return <span className="status-badge completed">Finalizada</span>;
        } else if (asambleaDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
            return <span className="status-badge upcoming">Próxima</span>;
        } else {
            return <span className="status-badge scheduled">Programada</span>;
        }
    };

    return (
        <div className="asamblea-container">
            <div className="asamblea-header">
                <Search 
                    value={filter} 
                    onChange={e => setFilter(e.target.value)} 
                    placeholder="Buscar asamblea por tema o sala..." 
                />
                <div className="asamblea-stats">
                    <span className="stat-item">
                        <strong>{filteredAsambleas.length}</strong> asambleas
                    </span>
                </div>
            </div>

            <div className="asamblea-table-container">
                <table className="asamblea-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('Temas')} className="sortable">
                                Tema
                                {sortField === 'Temas' && (
                                    <span className="sort-indicator">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Fecha')} className="sortable">
                                Fecha y Hora
                                {sortField === 'Fecha' && (
                                    <span className="sort-indicator">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Sala')} className="sortable">
                                Sala
                                {sortField === 'Sala' && (
                                    <span className="sort-indicator">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th>Estado</th>
                            <th>Asistencia</th>
                            {(userRole === 'admin' || userRole === 'vocalia') && (
                                <th>Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAsambleas.length === 0 ? (
                            <tr>
                                <td colSpan={userRole === 'admin' || userRole === 'vocalia' ? 6 : 5} className="no-data">
                                    <div className="no-data-content">
                                        <span className="no-data-icon">📋</span>
                                        <p>No se encontraron asambleas</p>
                                        {filter && <p>Intenta con otros términos de búsqueda</p>}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            sortedAsambleas.map((asamblea) => (
                                <tr key={asamblea.id} className="asamblea-row">
                                    <td className="tema-cell">
                                        <div className="tema-content">
                                            <h4>{asamblea.Temas}</h4>
                                        </div>
                                    </td>
                                    <td className="fecha-cell">
                                        <div className="fecha-content">
                                            <span className="fecha">{formatDate(asamblea.Fecha)}</span>
                                        </div>
                                    </td>
                                    <td className="sala-cell">
                                        <span className="sala-badge">{asamblea.Sala}</span>
                                    </td>
                                    <td className="status-cell">
                                        {getStatusBadge(asamblea)}
                                    </td>
                                    <td className="asistencia-cell">
                                        <div className="asistencia-info">
                                            <span className={`asistencia-status ${asamblea.AsistenciaAbierta ? 'open' : 'closed'}`}>
                                                {asamblea.AsistenciaAbierta ? 'Abierta' : 'Cerrada'}
                                            </span>
                                            {asamblea.ClaveAsistencia && (userRole === 'admin' || userRole === 'vocalia') && (
                                                <small className="clave-asistencia">
                                                    Clave: {asamblea.ClaveAsistencia}
                                                </small>
                                            )}
                                        </div>
                                    </td>
                                    {(userRole === 'admin' || userRole === 'vocalia') && (
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                <button 
                                                    onClick={() => onEdit(asamblea)}
                                                    className="action-btn edit-btn"
                                                    title={asamblea.AsistenciaAbierta ? "Cerrar asistencia" : "Abrir asistencia"}
                                                >
                                                    {asamblea.AsistenciaAbierta ? "🔒" : "🔓"}
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(asamblea.id)}
                                                    className="action-btn delete-btn"
                                                    title="Eliminar asamblea"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AsambleaTable; 