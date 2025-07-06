import { useState, useEffect } from 'react';
import { getActividades, createActividad, updateActividad, deleteActividad } from '@services/actividad.service.js';
import ActividadTable from '@components/ActividadTable';
import ActividadForm from '@components/ActividadForm';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import { useAuth } from '@context/AuthContext';

const Actividades = () => {
    const [actividades, setActividades] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Cargar actividades
    useEffect(() => {
        fetchActividades();
    }, []);

    const fetchActividades = async () => {
        const res = await getActividades();
        setActividades(res);
    };

    const handleCrear = () => {
        setFormData({}); // Formulario vacío
        setMostrarForm(true);
    };

    const handleEditar = (actividad) => {
        setFormData(actividad);
        setMostrarForm(true);
    };

    const handleEliminar = async (id) => { // Confirmación antes de eliminar
        if (window.confirm("¿Seguro que deseas eliminar esta actividad?")) {
        try { // Verifica si el usuario confirma la eliminación
            setLoading(true);
            await deleteActividad(id);
            showSuccessAlert('Eliminada', 'La actividad fue eliminada');
            fetchActividades();
        } catch (e) {
            showErrorAlert('Error', e.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
        }
    };

    const onSubmit = async (data) => { // Manejo del formulario
        try {
        setLoading(true);
        if (formData) { // Si hay datos de formulario, se trata de una edición
            await updateActividad(formData.id, data);
            showSuccessAlert('Editada', 'Actividad editada con éxito');
        } else { // Si no hay datos, se trata de una creación
            await createActividad(data);
            showSuccessAlert('Creada', 'Actividad creada con éxito');
        }
        setMostrarForm(false);
        fetchActividades();
        } catch (e) {
        showErrorAlert('Error', e.message || 'Ocurrió un error');
        } finally {
        setLoading(false);
        }
    };

    return ( // Renderizado del componente
        <div className="container">
        <h1>Gestión de Actividades</h1>
        {(user?.rol === 'admin' || user?.rol === 'vocalia') && (
            <button onClick={handleCrear}>Nueva actividad</button>
        )}
        <ActividadTable
            actividades={actividades}
            onEdit={handleEditar}
            onDelete={handleEliminar}
            userRole={user?.rol}
        />
        {mostrarForm && ( // Mostrar formulario si se está creando o editando
            <ActividadForm
            initialData={formData}
            onSubmit={onSubmit}
            onCancel={() => setMostrarForm(false)}
            isEditing={!!formData}
            loading={loading}
            />
        )}
        </div>
    );
};

export default Actividades;
