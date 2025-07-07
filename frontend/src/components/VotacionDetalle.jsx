// Componente para mostrar los detalles de una votación específica
import React from 'react';
import { useVotacionDetalle } from '@hooks/useVotacionDetalle.jsx';


const DetalleVotacion = (props) => {
    const { votacionSeleccionada, user, handleEliminar, conteo, votos, loadingResultados, errorResultados } = useVotacionDetalle(props);
    const { handleVotar } = props;

    if (props.loading) {
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
                                {/* Botón para votar, solo si la votación está abierta */}
                                {votacionSeleccionada.estado && handleVotar && (
                                    <button
                                        className="btn-votar"
                                        style={{ marginLeft: 12 }}
                                        onClick={() => handleVotar(votacionSeleccionada.id, opcion.id)}
                                    >
                                        🗳️ Votar
                                    </button>
                                )}
                                {/* Mostrar conteo si la votación está cerrada */}
                                {!votacionSeleccionada.estado && conteo.length > 0 && (
                                    <span className="opcion-conteo" style={{ marginLeft: 12, fontWeight: 'bold' }}>
                                        Votos: {conteo.find(c => c.opcionId === opcion.id)?.cantidad || 0}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-opciones">
                    <p>⚠️ Esta votación no tiene opciones configuradas</p>
                </div>
            )}
            {/* Resultados de votos individuales si la votación está cerrada */}
            {!votacionSeleccionada.estado && (
                <div className="resultados-votacion">
                    <h4>📊 Resultados de la votación</h4>
                    {loadingResultados && <p>Cargando resultados...</p>}
                    {errorResultados && <p style={{ color: 'red' }}>{errorResultados}</p>}
                    {!loadingResultados && !errorResultados && (
                        <>
                            <h5>Votos registrados:</h5>
                            <ul>
                                {votos.length > 0 ? votos.map((v, idx) => {
                                    // Determinar el texto de la opción de forma segura
                                    let opcionStr = v.opcionTexto;
                                    if (!opcionStr && v.opcion && typeof v.opcion === 'object') {
                                        opcionStr = v.opcion.texto || v.opcion.nombre || v.opcion.id;
                                    } else if (!opcionStr) {
                                        opcionStr = v.opcionId;
                                    }
                                    return (
                                        <li key={v.id || idx}>
                                            Voto registrado por <strong>{opcionStr}</strong>
                                        </li>
                                    );
                                }) : <li>No hay votos registrados.</li>}
                            </ul>
                        </>
                    )}
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
