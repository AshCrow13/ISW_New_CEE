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
import { Dialog, DialogTitle, DialogContent, Button, Box, Typography } from '@mui/material';

const Documentos = () => {
    const [documentos, setDocumentos] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchDocumentos();
    }, []);

    const fetchDocumentos = async () => {
        const res = await getDocumentos();
        setDocumentos(res);
    };

    const handleCrear = () => {
        setFormData(null); 
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
            <Typography variant="h4" gutterBottom>
                Gestión de Documentos
            </Typography>
            {(user?.rol === 'admin' || user?.rol === 'vocalia') && (
                <Button
                    variant="contained"
                    sx={{ mb: 2 }}
                    onClick={handleCrear}
                >
                    Nuevo documento
                </Button>
            )}

            <DocumentoTable
                documentos={documentos}
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
                    {formData ? "Editar Documento" : "Nuevo Documento"}
                </DialogTitle>
                <DialogContent>
                    <DocumentoForm
                        initialData={formData || {}}
                        onSubmit={onSubmit}
                        onCancel={() => {
                            setFormOpen(false);
                            setFormData(null);
                        }}
                        isEditing={!!formData}
                        loading={loading}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Documentos;
