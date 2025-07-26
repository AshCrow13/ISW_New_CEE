import { useState, useEffect, useMemo } from 'react';
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
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Button, 
    Box, 
    Typography, 
    Paper, 
    Divider, 
    TextField, 
    InputAdornment 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SearchIcon from '@mui/icons-material/Search';

const Documentos = () => { // Componente principal para la gestión de documentos
    const [documentos, setDocumentos] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const { user } = useAuth(); // Obtener información del usuario autenticado

    useEffect(() => {
        fetchDocumentos();
    }, []);

    const fetchDocumentos = async () => {
        const res = await getDocumentos();
        setDocumentos(res);
    };

    // Filtrar documentos basados en el término de búsqueda
    const filteredDocumentos = useMemo(() => {
        if (!searchTerm.trim()) return documentos;
        
        return documentos.filter(doc => 
            doc.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [documentos, searchTerm]);

    // Función para verificar si el usuario puede crear ciertos tipos de documentos
    const canCreateDocumentType = (userRole, docType) => {
        if (userRole === "admin") return true;
        if (userRole === "vocalia" && (docType === "Actividad" || docType === "Otros")) return true;
        return false;
    };

    // Función para mostrar el modal de creación con el tipo pre-seleccionado si es vocalia
    const handleCrear = () => {
        // Asegurarse de que initialData no tenga un ID
        let initialData = { id: null };
        
        // Si es vocalia, preseleccionar el tipo que puede crear
        if (user?.rol === 'vocalia') {
            initialData = { id: null, tipo: 'Actividad' };
        }
        
        setFormData(initialData); // Inicializar formData con el tipo preseleccionado
        setFormOpen(true);
    };

    const handleEditar = (doc) => { // Función para editar un documento
        setFormData(doc);
        setFormOpen(true);
    };

    const handleEliminar = async (id) => { // Función para eliminar un documento
        if (window.confirm("¿Seguro que deseas eliminar este documento?")) {
            try {
                setLoading(true); // Mostrar indicador de carga
                await deleteDocumento(id); // Llamar al servicio para eliminar el documento
                showSuccessAlert('Eliminado', 'El documento fue eliminado');
                fetchDocumentos(); // Refrescar la lista de documentos
            } catch (e) {
                showErrorAlert('Error', e.message || 'Ocurrió un error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDownload = async (id) => {
        try {
            const blob = await downloadDocumento(id); // Llamar al servicio para descargar el documento
            // Buscar el documento por id para obtener el título
            const doc = documentos.find(d => d.id === id);
            let nombre = doc?.titulo || `documento_${id}`;
            // Sanitizar el nombre para evitar caracteres inválidos
            nombre = nombre
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9_\-]/g, "_")
                .replace(/_+/g, "_")
                .replace(/^_+|_+$/g, "")
                .substring(0, 40);
            if (!nombre) nombre = `documento_${id}`;
            // Obtener extensión del archivo original si está disponible
            let ext = "";
            if (doc?.urlArchivo) {
                const parts = doc.urlArchivo.split(".");
                if (parts.length > 1) ext = "." + parts.pop();
            }
            const url = window.URL.createObjectURL(blob); // Crear un objeto URL para el blob
            const link = document.createElement('a');
            link.href = url;
            link.download = nombre + ext;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            showErrorAlert('Error', e.message || 'No se pudo descargar el archivo');
        }
    };

    const onSubmit = async (formDataObj) => {
        try {
            setLoading(true); // Mostrar indicador de carga
            if (formData && formData.id) {
                // Solo llamar a updateDocumento si formData tiene un id válido
                await updateDocumento(formData.id, formDataObj);
                showSuccessAlert('Editado', 'Documento editado con éxito');
            } else {
                // Si no hay id o formData es null, crear nuevo documento
                await createDocumento(formDataObj);
                showSuccessAlert('Creado', 'Documento creado con éxito');
            }
            setFormOpen(false); // Cerrar el formulario
            setFormData(null); // Limpiar formData
            fetchDocumentos(); // Refrescar la lista de documentos
        } catch (e) {
            console.error("Error en documento submit:", e);
            showErrorAlert('Error', e.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Gestión de Documentos
                    </Typography>
                    {(user?.rol === 'admin' || user?.rol === 'vocalia') && (
                        <Button
                            variant="contained"
                            startIcon={<NoteAddIcon />}
                            onClick={handleCrear}
                            sx={{ borderRadius: 2 }}
                        >
                            Nuevo documento
                        </Button>
                    )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="text.secondary">
                        Aquí encontrarás todos los documentos organizados por categorías. Puedes expandir cada sección para ver su contenido.
                    </Typography>
                    {/* Campo de búsqueda */}
                    <TextField
                        placeholder="Buscar documentos..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: '300px', maxWidth: '100%' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Paper>

            <DocumentoTable
                documentos={filteredDocumentos}
                onEdit={handleEditar}
                onDelete={handleEliminar}
                onDownload={handleDownload}
                userRole={user?.rol}
            />

            <Dialog
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setFormData(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {formData?.id ? "Editar Documento" : "Nuevo Documento"}
                </DialogTitle>
                <DialogContent>
                    <DocumentoForm
                        initialData={formData || {}}
                        onSubmit={onSubmit}
                        onCancel={() => {
                            setFormOpen(false);
                            setFormData(null);
                        }}
                        isEditing={!!formData?.id}
                        loading={loading}
                        userRole={user?.rol} // Pasar el rol para controlar opciones en el formulario
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Documentos;
