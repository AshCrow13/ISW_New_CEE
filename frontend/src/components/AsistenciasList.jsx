import { useState, useEffect } from 'react';
import { getAsistenciasInstancia } from '@services/asistencia.service.js';
import { showErrorAlert } from '@helpers/sweetAlert';
import '@styles/asamblea.css';

const AsistenciasList = ({ asamblea, onClose }) => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAsistencias();
    }, [asamblea.id]);

    const fetchAsistencias = async () => {
        try {
            setLoading(true);
            const data = await getAsistenciasInstancia(asamblea.id);
            setAsistencias(data || []);
        } catch (error) {
            showErrorAlert('Error', 'No se pudieron cargar las asistencias');
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

    const filteredAsistencias = asistencias.filter(asistencia =>
        asistencia.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asistencia.rut?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (index) => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[index % colors.length];
    };

    return (
        <div className="asamblea-form-overlay">
            <div className="asamblea-form-container asistencias-form-container">
                <div className="form-header">
                    <h2>Asistencias Registradas</h2>
                    <button onClick={onClose} className="close-btn">
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
                                <span className="info-label">👥 Total Asistencias:</span>
                                <span className="info-value asistencia-count">{asistencias.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="search-section">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o RUT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    <div className="search-stats">
                        <span className="stat-badge">
                            {filteredAsistencias.length} de {asistencias.length} asistencias
                        </span>
                    </div>
                </div>

                <div className="asistencias-content">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Cargando asistencias...</p>
                        </div>
                    ) : asistencias.length === 0 ? (
                        <div className="no-data">
                            <div className="no-data-content">
                                <span className="no-data-icon">👥</span>
                                <h3>No hay asistencias registradas</h3>
                                <p>Los estudiantes aún no han registrado su asistencia en esta asamblea.</p>
                            </div>
                        </div>
                    ) : filteredAsistencias.length === 0 ? (
                        <div className="no-data">
                            <div className="no-data-content">
                                <span className="no-data-icon">🔍</span>
                                <h3>No se encontraron resultados</h3>
                                <p>Intenta con otros términos de búsqueda.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="asistencias-grid">
                            {filteredAsistencias.map((asistencia, index) => (
                                <div 
                                    key={index} 
                                    className="asistencia-card"
                                    style={{ borderLeftColor: getStatusColor(index) }}
                                >
                                    <div className="asistencia-avatar">
                                        <span className="avatar-text">
                                            {asistencia.nombreCompleto.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="asistencia-info">
                                        <h4 className="asistencia-nombre">{asistencia.nombreCompleto}</h4>
                                        <p className="asistencia-rut">{asistencia.rut}</p>
                                    </div>
                                    <div className="asistencia-badge">
                                        <span className="badge-icon">✅</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button onClick={onClose} className="cancel-btn">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AsistenciasList; 