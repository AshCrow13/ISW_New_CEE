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
            
            <div className="detail-meta">
                <p><strong>ID:</strong> {votacionSeleccionada.id}</p>
                <p><strong>Nombre:</strong> {votacionSeleccionada.nombre}</p>
                <p><strong>Inicio:</strong> {new Date(votacionSeleccionada.inicio).toLocaleString()}</p>
                <p><strong>Fin:</strong> {new Date(votacionSeleccionada.fin).toLocaleString()}</p>
                <p><strong>Duración:</strong> {votacionSeleccionada.duracion} minutos</p>
                <p><strong>Estado:</strong> 
                    <span className={`estado-badge ${votacionSeleccionada.estado ? 'abierta' : 'cerrada'}`}>
                        {votacionSeleccionada.estado ? '🟢 Abierta' : '🔴 Cerrada'}
                    </span>
                </p>
            </div>
            
            {votacionSeleccionada.opciones && votacionSeleccionada.opciones.length > 0 ? (
                <div className="opciones-list">
                    <h4>📝 Opciones de votación:</h4>
                    <div className="opciones-container">
                        {votacionSeleccionada.opciones.map((opcion, index) => (
                            <div key={opcion.id || index} className="opcion-item">
                                <span className="opcion-numero">{index + 1}</span>
                                <span className="opcion-texto">
                                    {typeof opcion === 'string' ? opcion : opcion.texto}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-opciones">
                    <p>⚠️ Esta votación no tiene opciones configuradas</p>
                </div>
            )}
            
            {user && user.rol === 'admin' && (
                <div className="card-actions">
                    <button
                        onClick={() => handleEliminar(votacionSeleccionada.id)}
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
