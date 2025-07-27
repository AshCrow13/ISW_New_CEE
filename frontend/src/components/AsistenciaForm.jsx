import { useState } from 'react';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import '@styles/asamblea.css';

const AsistenciaForm = ({ asamblea, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        clave: '',
        error: {}
    });
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let error = {};
        if (!form.clave.trim()) {
            error.clave = "Por favor ingresa la clave de asistencia";
        } else if (form.clave.trim().length !== 6) {
            error.clave = "La clave debe tener exactamente 6 caracteres";
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
            error: { ...prev.error, [name]: undefined }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setForm(prev => ({ ...prev, error: errors }));
            return;
        }

        setLoading(true);
        try {
            // Obtener datos del usuario desde sessionStorage
            const usuario = JSON.parse(sessionStorage.getItem('usuario'));
            
            if (!usuario || !usuario.rut) {
                showErrorAlert('Error', 'No se pudo obtener la información del usuario');
                return;
            }

            const asistenciaData = {
                rut: usuario.rut,
                idInstancia: asamblea.id,
                clave: form.clave.trim()
            };

            // Importar el servicio dinámicamente para evitar problemas de importación
            const { registrarAsistencia } = await import('@services/asistencia.service.js');
            await registrarAsistencia(asistenciaData);
            
            showSuccessAlert('¡Éxito!', 'Asistencia registrada correctamente');
            onSuccess();
            onClose();
        } catch (error) {
            const mensaje = error.message || 'Error al registrar la asistencia';
            showErrorAlert('Error', mensaje);
        } finally {
            setLoading(false);
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

    return (
        <div className="asamblea-form-overlay">
            <div className="asamblea-form-container asistencia-form-container">
                <form onSubmit={handleSubmit} className="asamblea-form">
                    <div className="form-header">
                        <h2>Registrar Asistencia</h2>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="close-btn"
                            disabled={loading}
                        >
                            ×
                        </button>
                    </div>

                    <div className="asamblea-info-section">
                        <div className="asamblea-info-card">
                            <div className="asamblea-info-header">
                                <span className="asamblea-icon">📋</span>
                                <h3>{asamblea.Temas}</h3>
                            </div>
                            <div className="asamblea-info-details">
                                <div className="info-item">
                                    <span className="info-label">📅 Fecha:</span>
                                    <span className="info-value">{formatDate(asamblea.Fecha)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">🏢 Sala:</span>
                                    <span className="info-value">{asamblea.Sala}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">🔑 Clave:</span>
                                    <span className="info-value clave-display">{asamblea.ClaveAsistencia}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <label className="form-label">
                            Clave de Asistencia *
                            <div className="clave-input-container">
                                <input
                                    type="text"
                                    name="clave"
                                    value={form.clave}
                                    onChange={handleChange}
                                    placeholder="Ingresa la clave de 6 dígitos"
                                    maxLength={6}
                                    disabled={loading}
                                    className={`form-input clave-input ${form.error.clave ? 'error' : ''}`}
                                    autoFocus
                                />
                                <div className="clave-dots">
                                    {[...Array(6)].map((_, index) => (
                                        <span 
                                            key={index} 
                                            className={`clave-dot ${index < form.clave.length ? 'filled' : ''}`}
                                        >
                                            {form.clave[index] || ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <small>Ingresa la clave proporcionada por el organizador de la asamblea</small>
                            {form.error.clave && <span className="form-error">{form.error.clave}</span>}
                        </label>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading || !form.clave.trim()}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner-small"></span>
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">✅</span>
                                    Registrar Asistencia
                                </>
                            )}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="cancel-btn"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AsistenciaForm; 