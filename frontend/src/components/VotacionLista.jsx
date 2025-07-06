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
            {votaciones.map((votacion) => (
                <div key={votacion._id} className="votacion-card">
                    <h3>{votacion.titulo}</h3>
                    <p>{votacion.descripcion}</p>
                    
                    <div className="votacion-meta">
                        <strong>ID:</strong> {votacion._id}
                    </div>
                    <div className="votacion-meta">
                        <strong>Inicio:</strong> {new Date(votacion.inicio).toLocaleString()}
                    </div>
                    <div className="votacion-meta">
                        <strong>Fin:</strong> {new Date(votacion.fin).toLocaleString()}
                    </div>
                    <div className="votacion-meta">
                        <strong>Estado:</strong> {votacion.estado}
                    </div>
                    
                    {user && user.rol === 'admin' && (
                        <div className="card-actions">
                            <button
                                onClick={() => handleEliminar(votacion._id)}
                                className="btn-danger"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ListaVotaciones;
