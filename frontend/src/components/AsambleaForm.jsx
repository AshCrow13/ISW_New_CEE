import { useState, useEffect } from 'react';
import '@styles/asamblea.css';

const generateRandomKeyString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const AsambleaForm = ({ initialData = {}, onSubmit, onCancel, isEditing = false, loading = false }) => {
    const [form, setForm] = useState({
        Temas: initialData.Temas || "",
        Fecha: initialData.Fecha ? new Date(initialData.Fecha).toISOString().slice(0, 16) : "",
        Sala: initialData.Sala || "",
        AsistenciaAbierta: initialData.AsistenciaAbierta || false,
        ClaveAsistencia: initialData.ClaveAsistencia || (!isEditing ? generateRandomKeyString() : ""),
        error: {},
    });

    const [charCount, setCharCount] = useState(form.Temas.length);

    useEffect(() => {
        setCharCount(form.Temas.length);
    }, [form.Temas]);

    useEffect(() => {
        if (!form.AsistenciaAbierta) {
            setForm(prev => ({ ...prev, ClaveAsistencia: prev.ClaveAsistencia || (!isEditing ? generateRandomKeyString() : "") }));
        }
    }, [form.AsistenciaAbierta, isEditing]);

    // Validación
    const validate = () => {
        let error = {};
        if (!form.Temas || form.Temas.length < 2) {
            error.Temas = "El tema debe tener al menos 2 caracteres.";
        }
        if (!form.Temas || form.Temas.length > 300) {
            error.Temas = "El tema debe tener máximo 300 caracteres.";
        }
        if (!form.Fecha) {
            error.Fecha = "Debe ingresar una fecha y hora.";
        } else {
            const selectedDate = new Date(form.Fecha);
            const now = new Date();
            if (selectedDate < now) {
                error.Fecha = "La fecha no puede ser anterior a la actual.";
            }
        }
        if (!form.Sala || form.Sala.length < 2) {
            error.Sala = "La sala debe tener al menos 2 caracteres.";
        }
        if (!form.Sala || form.Sala.length > 100) {
            error.Sala = "La sala debe tener máximo 100 caracteres.";
        }
        if (form.AsistenciaAbierta && (!form.ClaveAsistencia || form.ClaveAsistencia.length !== 6)) {
            error.ClaveAsistencia = "Error en la generación de la clave de asistencia.";
        }
        return error;
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => {
            let newForm = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
                error: { ...prev.error, [name]: undefined }
            };
            // Si se desactiva la asistencia, limpiar la clave
            if (name === 'AsistenciaAbierta' && !checked) {
                newForm.ClaveAsistencia = prev.ClaveAsistencia || (!isEditing ? generateRandomKeyString() : "");
            }
            return newForm;
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setForm(prev => ({ ...prev, error: errors }));
            return;
        }
        const fechaISO = form.Fecha ? new Date(form.Fecha).toISOString() : null;
        const normalizado = { 
            ...form,
            Temas: form.Temas.trim(),
            Sala: form.Sala.trim(),
            Fecha: fechaISO
        };
        if (form.AsistenciaAbierta) {
            normalizado.ClaveAsistencia = form.ClaveAsistencia;
        } else {
            delete normalizado.ClaveAsistencia;
        }
        delete normalizado.error;
        onSubmit(normalizado);
    };

    return (
        <div className="asamblea-form-overlay">
            <div className="asamblea-form-container">
                <form onSubmit={handleSubmit} className="asamblea-form">
                    <div className="form-header">
                        <h2>{isEditing ? "Editar Asamblea" : "Nueva Asamblea"}</h2>
                        <button type="button" onClick={onCancel} className="close-btn">×</button>
                    </div>

                    <div className="form-section">
                        <label className="form-label">
                            Tema de la Asamblea *
                            <textarea
                                name="Temas"
                                value={form.Temas}
                                onChange={handleChange}
                                placeholder="Ej: Discusión sobre el nuevo reglamento estudiantil"
                                minLength={2}
                                maxLength={300}
                                required
                                className={`form-input ${form.error.Temas ? 'error' : ''}`}
                            />
                            <small className="char-count">{charCount}/300 caracteres</small>
                            {form.error.Temas && <span className="form-error">{form.error.Temas}</span>}
                        </label>
                    </div>

                    <div className="form-row">
                        <div className="form-section">
                            <label className="form-label">
                                Fecha y Hora *
                                <input
                                    name="Fecha"
                                    type="datetime-local"
                                    value={form.Fecha}
                                    onChange={handleChange}
                                    required
                                    className={`form-input ${form.error.Fecha ? 'error' : ''}`}
                                />
                                <small>Selecciona fecha y hora de la asamblea</small>
                                {form.error.Fecha && <span className="form-error">{form.error.Fecha}</span>}
                            </label>
                        </div>

                        <div className="form-section">
                            <label className="form-label">
                                Sala *
                                <input
                                    name="Sala"
                                    type="text"
                                    value={form.Sala}
                                    onChange={handleChange}
                                    placeholder="Ej: Auditorio Principal"
                                    minLength={2}
                                    maxLength={100}
                                    required
                                    className={`form-input ${form.error.Sala ? 'error' : ''}`}
                                />
                                {form.error.Sala && <span className="form-error">{form.error.Sala}</span>}
                            </label>
                        </div>
                    </div>

                    <div className="form-section">
                        <label className="checkbox-label">
                            <input
                                name="AsistenciaAbierta"
                                type="checkbox"
                                checked={form.AsistenciaAbierta}
                                onChange={handleChange}
                            />
                            <span className="checkmark"></span>
                            Habilitar control de asistencia
                        </label>
                        <small>Si se activa, los estudiantes podrán registrar su asistencia con una clave</small>
                    </div>

                    {form.AsistenciaAbierta && (
                        <div className="form-section">
                            <label className="form-label">
                                Clave de Asistencia *
                                <input
                                    name="ClaveAsistencia"
                                    type="text"
                                    value={form.ClaveAsistencia}
                                    readOnly
                                    placeholder="Se generará automáticamente"
                                    className="form-input readonly"
                                />
                                <small>Clave de 6 caracteres generada automáticamente para el control de asistencia</small>
                                {form.error.ClaveAsistencia && <span className="form-error">{form.error.ClaveAsistencia}</span>}
                            </label>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Asamblea"}
                        </button>
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AsambleaForm; 