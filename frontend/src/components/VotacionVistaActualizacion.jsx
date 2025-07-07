import { useVotacionVistaActualizacion } from '@hooks/useVotacionVistaActualizacion.jsx';
import '@styles/form.css';
import '@styles/votacion.css';

const VistaActualizacion = ({ user, onActualizar }) => {
    const {
        step,
        searchId,
        setSearchId,
        votacionOriginal,
        formData,
        errors,
        loading,
        submitting,
        handleInputChange,
        handleOpcionChange,
        agregarOpcion,
        eliminarOpcion,
        handleSubmit,
        buscarVotacion,
        volverABuscar
    } = useVotacionVistaActualizacion({ user, onActualizar });

    if (!user || user.rol !== 'admin') {
        return (
            <div className="error-container">
                <p>❌ No tienes permisos para actualizar votaciones</p>
            </div>
        );
    }

    return (
        <div className="actualizacion-container">
            {/* Paso 1: Buscar votación */}
            {step === 'buscar' && (
                <div className="buscar-votacion">
                    <h3>🔍 Buscar Votación a Actualizar</h3>
                    <div className="search-group">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ingresa el ID de la votación"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && buscarVotacion()}
                        />
                        <button
                            type="button"
                            className="btn-search"
                            onClick={buscarVotacion}
                            disabled={loading}
                        >
                            {loading ? "Buscando..." : "🔍 Buscar"}
                        </button>
                    </div>
                    <p className="help-text">
                        💡 Puedes obtener el ID desde la lista de "Ver Todas las Votaciones"
                    </p>
                </div>
            )}

            {/* Paso 2: Editar votación */}
            {step === 'editar' && votacionOriginal && (
                <div className="editar-votacion">
                    <div className="votacion-info">
                        <h3>📝 Actualizando Votación</h3>
                        <div className="info-card">
                            <p><strong>ID:</strong> {votacionOriginal.id}</p>
                            <p><strong>Estado:</strong> {votacionOriginal.estado ? '🟢 Activa' : '🔴 Inactiva'}</p>
                            <p><strong>Creada:</strong> {
                                (() => {
                                    try {
                                        const fechaCreacion = votacionOriginal.fecha_inicio || votacionOriginal.inicio;
                                        return new Date(fechaCreacion).toLocaleString();
                                    } catch (error) {
                                        return 'Fecha no disponible';
                                    }
                                })()
                            }</p>
                        </div>
                        <button
                            type="button"
                            className="btn-back"
                            onClick={volverABuscar}
                        >
                            ⬅️ Buscar Otra Votación
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="votacion-form">
                        {/* Título */}
                        <div className="form-group">
                            <label className="form-label">
                                Título de la Votación *
                            </label>
                            <input
                                type="text"
                                className={`form-input ${errors.titulo ? 'error' : ''}`}
                                value={formData.titulo}
                                onChange={(e) => handleInputChange('titulo', e.target.value)}
                                placeholder="Título de la votación"
                            />
                            {errors.titulo && (
                                <span className="error-message">{errors.titulo}</span>
                            )}
                        </div>

                        {/* Fechas */}
                        <div className="form-group-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Fecha y Hora de Inicio *
                                </label>
                                <input
                                    type="datetime-local"
                                    className={`form-input ${errors.fechaInicio ? 'error' : ''}`}
                                    value={formData.fechaInicio}
                                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                                />
                                {errors.fechaInicio && (
                                    <span className="error-message">{errors.fechaInicio}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Fecha y Hora de Fin *
                                </label>
                                <input
                                    type="datetime-local"
                                    className={`form-input ${errors.fechaFin ? 'error' : ''}`}
                                    value={formData.fechaFin}
                                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                                />
                                {errors.fechaFin && (
                                    <span className="error-message">{errors.fechaFin}</span>
                                )}
                            </div>
                        </div>

                        {/* Opciones de votación */}
                        <div className="opciones-container">
                            <label className="form-label">
                                Opciones de Votación *
                            </label>
                            {formData.opciones.map((opcion, index) => (
                                <div key={index} className="opcion-item">
                                    <span className="opcion-numero">
                                        {index + 1}.
                                    </span>
                                    <input
                                        type="text"
                                        className="opcion-input"
                                        value={opcion}
                                        onChange={(e) => handleOpcionChange(index, e.target.value)}
                                        placeholder={`Opción ${index + 1}`}
                                    />
                                    {formData.opciones.length > 2 && (
                                        <button
                                            type="button"
                                            className="btn-eliminar-opcion"
                                            onClick={() => eliminarOpcion(index)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn-agregar-opcion"
                                onClick={agregarOpcion}
                            >
                                + Agregar Opción
                            </button>
                            {errors.opciones && (
                                <div className="error-message">
                                    {errors.opciones}
                                </div>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="botones-form">
                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={volverABuscar}
                                disabled={submitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={submitting}
                            >
                                {submitting ? "Actualizando..." : "✅ Actualizar Votación"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default VistaActualizacion;
