import { useState, useEffect } from "react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    Stack
} from "@mui/material";

const DocumentoForm = ({
    initialData = {},
    onSubmit,
    onCancel,
    isEditing = false,
    loading = false,
    userRole = '',
    }) => {
    const [form, setForm] = useState({
        titulo: initialData.titulo || "",
        tipo: initialData.tipo || "",
    });
    const [archivo, setArchivo] = useState(null);
    const [error, setError] = useState({});

    useEffect(() => {
        // Ignorar id en initialData si es null o undefined para evitar confusión
        setForm({
            titulo: initialData.titulo || "",
            tipo: initialData.tipo || "",
        });
        setArchivo(null);
        setError({});
    }, [initialData, isEditing]);

    // Determinar qué tipos de documentos puede crear/editar el usuario según su rol
    const getTiposPermitidos = () => {
        if (userRole === 'admin') {
            return [
                { value: "Importantes", label: "Importantes" },
                { value: "Actividad", label: "Actividad" },
                { value: "Actas", label: "Actas" },
                { value: "Otros", label: "Otros" }
            ];
        } else if (userRole === 'vocalia') {
            return [
                { value: "Actividad", label: "Actividad" },
                { value: "Otros", label: "Otros" }
            ];
        }
        return [];
    };

    const tiposPermitidos = getTiposPermitidos();

    // Si es edición, verificar que el usuario tiene permiso para editar este documento
    useEffect(() => {
        if (isEditing && userRole === 'vocalia' && initialData.tipo) {
            const tipoPermitido = tiposPermitidos.some(t => t.value === initialData.tipo);
            if (!tipoPermitido) {
                // Si no tiene permiso para editar este tipo, cancelar
                onCancel();
            }
        }
    }, [isEditing, initialData.tipo, userRole]);

    const validate = () => {
        const err = {};
        if (!form.titulo || form.titulo.length < 5)
        err.titulo = "Debe tener al menos 5 caracteres.";
        if (!form.tipo) err.tipo = "Campo obligatorio.";
        if (!archivo && !isEditing) err.archivo = "Adjunta un archivo.";
        return err;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleFileChange = (e) => {
        setArchivo(e.target.files[0]);
        setError((prev) => ({ ...prev, archivo: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        if (Object.keys(err).length > 0) {
            setError(err);
            return;
        }
        
        // Crear FormData para enviar al servidor
        const data = new FormData();
        data.append("titulo", form.titulo);
        data.append("tipo", form.tipo);
        if (archivo) data.append("archivo", archivo);
        
        // Si estamos editando y hay un ID válido, incluirlo en los logs
        if (isEditing && initialData?.id) {
            console.log(`Editando documento con ID: ${initialData.id}`);
        } else {
            console.log('Creando nuevo documento');
        }
        
        onSubmit(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, minWidth: 340 }}>
            <Typography variant="h6" gutterBottom>
                {isEditing ? "Editar Documento" : "Nuevo Documento"}
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Título"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    required
                    error={!!error.titulo}
                    helperText={error.titulo}
                    inputProps={{ minLength: 5, maxLength: 100 }}
                />
                <TextField
                    select
                    label="Tipo"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                    error={!!error.tipo}
                    helperText={error.tipo}
                    disabled={isEditing} // No permitir cambiar el tipo en modo edición
                >
                    <MenuItem value="">Seleccione...</MenuItem>
                    {tiposPermitidos.map(tipo => (
                        <MenuItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="outlined" component="label" color={error.archivo ? "error" : "primary"}>
                    {archivo ? archivo.name : "Adjuntar archivo"}
                    <input type="file" hidden name="archivo" onChange={handleFileChange} />
                </Button>
                {error.archivo && (
                    <Typography color="error" fontSize={13}>
                        {error.archivo}
                    </Typography>
                )}
                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear"}
                    </Button>
                    <Button onClick={onCancel} variant="outlined" disabled={loading}>
                        Cancelar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default DocumentoForm;

