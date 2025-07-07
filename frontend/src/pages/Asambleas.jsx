import { useState, useEffect } from 'react';
import { getAsambleas, createAsamblea, updateAsamblea, deleteAsamblea } from '@services/asamblea.service.js';
import AsambleaTable from '@components/AsambleaTable';
import AsambleaForm from '@components/AsambleaForm';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import { useAuth } from '@context/AuthContext';
import '@styles/asamblea.css';

const Asambleas = () => {
    const [asambleas, setAsambleas] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Cargar asambleas
    useEffect(() => {
        fetchAsambleas();
    }, []);

    const fetchAsambleas = async () => {
        try {
            setLoading(true);
            const res = await getAsambleas();
            setAsambleas(res);
        } catch (error) {
            showErrorAlert('Error', 'No se pudieron cargar las asambleas');
        } finally {
            setLoading(false);
        }
    };



    const handleEditar = async (asamblea) => {
        try {
            setLoading(true);
            const nuevoEstado = !asamblea.AsistenciaAbierta;
            await updateAsamblea(asamblea.id, { AsistenciaAbierta: nuevoEstado });
            showSuccessAlert(
                nuevoEstado ? 'Asistencia Abierta' : 'Asistencia Cerrada', 
                `La asistencia ha sido ${nuevoEstado ? 'abierta' : 'cerrada'} correctamente`
            );
            fetchAsambleas();
        } catch (e) {
            showErrorAlert('Error', e.message || 'Ocurrió un error al cambiar el estado de asistencia');
        } finally {
            setLoading(false);
        }
    };

    const handleCrear = () => {
        setFormData({}); // Formulario vacío
        setMostrarForm(true);
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar esta asamblea?")) {
            try {
                setLoading(true);
                await deleteAsamblea(id);
                showSuccessAlert('Eliminada', 'La asamblea fue eliminada correctamente');
                fetchAsambleas();
            } catch (e) {
                showErrorAlert('Error', e.message || 'Ocurrió un error al eliminar la asamblea');
            } finally {
                setLoading(false);
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (formData?.id) { // Si hay id
                await updateAsamblea(formData.id, data);
                showSuccessAlert('Editada', 'Asamblea editada con éxito');
            } else { // Si no hay id
                await createAsamblea(data);
                showSuccessAlert('Creada', 'Asamblea creada con éxito');
            }
            setMostrarForm(false);
            setFormData(null);
            fetchAsambleas();
        } catch (e) {
            showErrorAlert('Error', e.message || 'Ocurrió un error al procesar la asamblea');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelForm = () => {
        setMostrarForm(false);
        setFormData(null);
    };

    return (
        <div className="asambleas-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>Gestión de Asambleas</h1>
                    <p>Administra las asambleas estudiantiles y sus configuraciones</p>
                </div>
                {(user?.rol === 'admin' || user?.rol === 'vocalia') && (
                    <button onClick={handleCrear} className="create-btn">
                        <span className="btn-icon">📋</span>
                        Nueva Asamblea
                    </button>
                )}
            </div>

            <div className="page-content">
                {loading && asambleas.length === 0 ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando asambleas...</p>
                    </div>
                ) : (
                    <AsambleaTable
                        asambleas={asambleas}
                        onEdit={handleEditar}
                        onDelete={handleEliminar}
                        userRole={user?.rol}
                    />
                )}
            </div>

            {mostrarForm && (
                <AsambleaForm
                    initialData={formData}
                    onSubmit={onSubmit}
                    onCancel={handleCancelForm}
                    isEditing={!!formData?.id}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Asambleas; 