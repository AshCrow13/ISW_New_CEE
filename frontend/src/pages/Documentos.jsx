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
import { Dialog, DialogTitle, DialogContent, Button, Box, Typography, Paper, Divider, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SearchIcon from '@mui/icons-material/Search';

const Documentos = () => {
    const [documentos, setDocumentos] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const { user } = useAuth();

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
        let initialData = {};
        
        // Si es vocalia, preseleccionar el tipo que puede crear
        if (user?.rol === 'vocalia') {
            initialData = { tipo: 'Actividad' };
        }
        
        setFormData(initialData); 
        setFormOpen(true);
    };

    const handleEditar = (doc) => {
        setFormData(doc);
        setFormOpen(true);
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este documento?")) {
            try {
                setLoading(true);
                await deleteDocumento(id);
                showSuccessAlert('Eliminado', 'El documento fue eliminado');
                fetchDocumentos();
            } catch (e) {
                showErrorAlert('Error', e.message || 'Ocurrió un error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDownload = async (id) => {
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

    const onSubmit = async (formDataObj) => {
        try {
            setLoading(true);
            if (formData) {
                await updateDocumento(formData.id, formDataObj);
                showSuccessAlert('Editado', 'Documento editado con éxito');
            } else {
                await createDocumento(formDataObj);
                showSuccessAlert('Creado', 'Documento creado con éxito');
            }
            setFormOpen(false);
            setFormData(null);
            fetchDocumentos();
        } catch (e) {
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
