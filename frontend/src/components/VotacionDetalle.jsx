// Componente para mostrar los detalles de una votación específica
import React from 'react';

const DetalleVotacion = ({ votacionSeleccionada, loading, user, handleEliminar }) => {
    if (loading) {
        return <p className="loading-message">🔄 Buscando votación...</p>;
    }

    if (!votacionSeleccionada) {
        return (
            <p className="error-message-page">
                ❌ Votación no encontrada
            </p>
        );
    }

    return (
        <div className="detail-card">
            <h3>{votacionSeleccionada.titulo}</h3>
            <p>{votacionSeleccionada.descripcion}</p>
            
            <div className="detail-meta">
                <p><strong>ID:</strong> {votacionSeleccionada._id}</p>
                <p><strong>Inicio:</strong> {new Date(votacionSeleccionada.inicio).toLocaleString()}</p>
                <p><strong>Fin:</strong> {new Date(votacionSeleccionada.fin).toLocaleString()}</p>
                <p><strong>Estado:</strong> {votacionSeleccionada.estado}</p>
            </div>
            
            {votacionSeleccionada.opciones && votacionSeleccionada.opciones.length > 0 && (
                <div className="opciones-list">
                    <h4>Opciones:</h4>
                    <ul>
                        {votacionSeleccionada.opciones.map((opcion, index) => (
                            <li key={index}>{opcion}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {user && user.rol === 'admin' && (
                <div className="card-actions">
                    <button
                        onClick={() => handleEliminar(votacionSeleccionada._id)}
                        className="btn-danger"
                    >
                        🗑️ Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

export default DetalleVotacion;
