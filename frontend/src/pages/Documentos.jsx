import { useState, useEffect } from 'react';
import {
    getDocumentos,
    createDocumento,
    updateDocumento,
    deleteDocumento,
    downloadDocumento
} from '@services/documento.service.js';
import DocumentoTable from '@components/DocumentoTable';
import DocumentoForm from '@components/DocumentoForm';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import { useAuth } from '@context/AuthContext';

const Documentos = () => { // Componente principal para la gestión de documentos
    const [documentos, setDocumentos] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => { // Efecto para cargar los documentos al montar el componente
        fetchDocumentos();
    }, []);

    const fetchDocumentos = async () => { // Función para obtener los documentos desde el servicio
        const res = await getDocumentos();
        setDocumentos(res);
    };

    const handleCrear = () => { // Función para manejar la creación de un nuevo documento
        setFormData({});
        setMostrarForm(true);
    };

    const handleEditar = (doc) => { // Función para manejar la edición de un documento existente
        setFormData(doc);
        setMostrarForm(true);
    };

    const handleEliminar = async (id) => { // Función para manejar la eliminación de un documento
        if (window.confirm("¿Seguro que deseas eliminar este documento?")) {
        try { // Verifica si el usuario confirma la eliminación
            setLoading(true);
            await deleteDocumento(id);
            showSuccessAlert('Eliminado', 'El documento fue eliminado');
            fetchDocumentos();
        } catch (e) { // Maneja errores durante la eliminación
            showErrorAlert('Error', e.message || 'Ocurrió un error');
        } finally { // Asegura que el estado de carga se actualice
            setLoading(false);
        }
        }
    };

    const handleDownload = async (id) => { // Función para manejar la descarga de un documento
        try {
        const blob = await downloadDocumento(id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documento_${id}`;
        link.click();
        window.URL.revokeObjectURL(url);
        } catch (e) {
        showErrorAlert('Error', e.message || 'No se pudo descargar el archivo');
        }
    };

    const onSubmit = async (formDataObj) => { // Función para manejar el envío del formulario de creación/edición
        try {
        setLoading(true);
        if (formData) { // Si hay datos de formulario, se trata de una edición
            await updateDocumento(formData.id, formDataObj);
            showSuccessAlert('Editado', 'Documento editado con éxito');
        } else {
            await createDocumento(formDataObj);
            showSuccessAlert('Creado', 'Documento creado con éxito');
        }
        setMostrarForm(false);
        fetchDocumentos();
        } catch (e) {
        showErrorAlert('Error', e.message || 'Ocurrió un error');
        } finally { // Asegura que el estado de carga se actualice
        setLoading(false);
        }
    };

    return ( // Renderiza el componente principal de gestión de documentos
        <div className="container">
        <h1>Gestión de Documentos</h1>
        {(user?.rol === 'admin' || user?.rol === 'vocalia') && (
            <button onClick={handleCrear}>Nuevo documento</button>
        )}
        <DocumentoTable
            documentos={documentos}
            onEdit={handleEditar}
            onDelete={handleEliminar}
            onDownload={handleDownload}
            userRole={user?.rol}
        />
        {mostrarForm && ( // Muestra el formulario de creación/edición si se ha activado
            <DocumentoForm
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

export default Documentos;
