// Componente para mostrar la lista de votaciones
import React from 'react';

const ListaVotaciones = ({ votaciones, loading, user, handleEliminar }) => {
    if (loading) {
        return <p className="loading-message">🔄 Cargando votaciones...</p>;
    }

    if (votaciones.length === 0) {
        return (
            <p className="empty-message">
                📭 No hay votaciones disponibles
            </p>
        );
    }

    return (
        <div className="votaciones-grid">
            {votaciones.map((votacion, index) => {
                return (
                    <div key={votacion.id || votacion._id || index} className="votacion-card">
                        <h3>{votacion.nombre || votacion.titulo || 'Sin título'}</h3>
                        
                        <div className="votacion-meta">
                            <strong>ID:</strong> {votacion.id || votacion._id || 'No disponible'}
                        </div>
                        <div className="votacion-meta">
                            <strong>Estado:</strong> 
                            <span className={`estado-badge ${votacion.estado ? 'activo' : 'inactivo'}`}>
                                {votacion.estado === true || votacion.estado === 'true' ? '🟢 Activa' : '🔴 Inactiva'}
                            </span>
                        </div>
                        <div className="votacion-meta">
                            <strong>Inicio:</strong> {votacion.inicio ? new Date(votacion.inicio).toLocaleString() : 'No definido'}
                        </div>
                        <div className="votacion-meta">
                            <strong>Fin:</strong> {votacion.fin ? new Date(votacion.fin).toLocaleString() : 'No definido'}
                        </div>
                        <div className="votacion-meta">
                            <strong>Duración:</strong> {votacion.duracion ? `${votacion.duracion} minutos` : 'No definida'}
                        </div>
                        
                        {user && (user.rol === 'admin' || user.rol === 'vocalia') && (
                            <div className="card-actions">
                                <button
                                    onClick={() => handleEliminar(votacion.id || votacion._id)}
                                    className="btn-danger"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ListaVotaciones;
