import { useVotacionFormularioCrear } from '@hooks/useVotacionFormularioCrear.jsx';
import '@styles/form.css';
import '@styles/votacion.css';


const FormularioCrearVotacion = ({ onSubmit, onSuccess, onCancel }) => {
    const {
        formData,
        errors,
        submitting,
        handleInputChange,
        handleOpcionChange,
        agregarOpcion,
        eliminarOpcion,
        handleSubmit
    } = useVotacionFormularioCrear({ onSubmit, onSuccess });

    return (
        <div className="votacion-form">
            <form onSubmit={handleSubmit}>
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
                        placeholder="Ej: Elección del nuevo presidente del CEE"
                    />
                    {errors.titulo && (
                        <span className="error-message">
                            {errors.titulo}
                        </span>
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
                            <span className="error-message">
                                {errors.fechaInicio}
                            </span>
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
                            <span className="error-message">
                                {errors.fechaFin}
                            </span>
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
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={submitting}
                    >
                        {submitting ? "Creando..." : "✅ Crear Votación"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearVotacion;
