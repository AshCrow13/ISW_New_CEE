import { useState } from 'react';
import { postVotacion } from '@services/votacion.service.js';
import '@styles/form.css';
import '@styles/votacion.css';

const FormularioCrearVotacion = ({ onSubmit, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        opciones: ['', ''] // Mínimo 2 opciones
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleOpcionChange = (index, value) => {
        const nuevasOpciones = [...formData.opciones];
        nuevasOpciones[index] = value;
        setFormData(prev => ({
            ...prev,
            opciones: nuevasOpciones
        }));
    };

    const agregarOpcion = () => {
        setFormData(prev => ({
            ...prev,
            opciones: [...prev.opciones, '']
        }));
    };

    const eliminarOpcion = (index) => {
        if (formData.opciones.length > 2) {
            const nuevasOpciones = formData.opciones.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                opciones: nuevasOpciones
            }));
        }
    };

    const validarFormulario = () => {
        const newErrors = {};

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'El título es obligatorio';
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es obligatoria';
        }

        if (!formData.fechaInicio) {
            newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
        } else {
            const fechaInicio = new Date(formData.fechaInicio);
            if (isNaN(fechaInicio.getTime())) {
                newErrors.fechaInicio = 'La fecha de inicio no es válida';
            } else if (fechaInicio < new Date()) {
                newErrors.fechaInicio = 'La fecha de inicio debe ser futura';
            }
        }

        if (!formData.fechaFin) {
            newErrors.fechaFin = 'La fecha de fin es obligatoria';
        } else {
            const fechaFin = new Date(formData.fechaFin);
            if (isNaN(fechaFin.getTime())) {
                newErrors.fechaFin = 'La fecha de fin no es válida';
            }
        }

        if (formData.fechaInicio && formData.fechaFin) {
            const fechaInicio = new Date(formData.fechaInicio);
            const fechaFin = new Date(formData.fechaFin);
            
            if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
                if (fechaInicio >= fechaFin) {
                    newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
                }
                
                // Verificar que la votación dure al menos 1 hora
                const duracionHoras = (fechaFin - fechaInicio) / (1000 * 60 * 60);
                if (duracionHoras < 1) {
                    newErrors.fechaFin = 'La votación debe durar al menos 1 hora';
                }
            }
        }

        const opcionesValidas = formData.opciones.filter(opcion => opcion.trim() !== '');
        if (opcionesValidas.length < 2) {
            newErrors.opciones = 'Debe tener al menos 2 opciones válidas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        setSubmitting(true);

        try {
            // Calcular duración en minutos
            const inicioDate = new Date(formData.fechaInicio);
            const finDate = new Date(formData.fechaFin);
            const duracionMinutos = Math.floor((finDate - inicioDate) / (1000 * 60));
            
            // Enviar datos en el formato que espera el backend
            const datosVotacion = {
                nombre: formData.titulo.trim(),
                duracion: duracionMinutos,
                opciones: formData.opciones.filter(opcion => opcion.trim() !== ''),
                estado: true
            };

            console.log('📅 Datos preparados para enviar:', datosVotacion);
            console.log('⏱️ Duración calculada:', duracionMinutos, 'minutos');

            let resultado;
            
            // Usar la función pasada desde el padre si está disponible, sino usar postVotacion directamente
            if (onSubmit) {
                resultado = await onSubmit(datosVotacion);
                if (resultado.success) {
                    // El manejo del éxito ya se hace en el componente padre
                    return;
                }
            } else {
                resultado = await postVotacion(datosVotacion);
                if (resultado.status === 'Success') {
                    alert('✅ Votación creada exitosamente');
                    onSuccess();
                    return;
                } else {
                    alert('❌ Error al crear la votación: ' + (resultado.message || 'Error desconocido'));
                }
            }
        } catch (error) {
            console.error('Error al crear votación:', error);
            alert('❌ Error al crear la votación');
        } finally {
            setSubmitting(false);
        }
    };

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

                {/* Descripción */}
                <div className="form-group">
                    <label className="form-label">
                        Descripción *
                    </label>
                    <textarea
                        className={`form-textarea ${errors.descripcion ? 'error' : ''}`}
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Describe la votación, candidatos, propósito, etc."
                        rows="4"
                    />
                    {errors.descripcion && (
                        <span className="error-message">
                            {errors.descripcion}
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
