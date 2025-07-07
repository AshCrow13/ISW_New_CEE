import { useState, useEffect } from "react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    Stack
} from "@mui/material";

const defaultFields = [
    {
        label: "Título",
        name: "titulo",
        fieldType: "input",
        type: "text",
        required: true,
        minLength: 5,
        maxLength: 100,
    },
    {
        label: "Tipo",
        name: "tipo",
        fieldType: "select",
        required: true,
        options: [
        { value: "acta", label: "Acta" },
        { value: "comunicado", label: "Comunicado" },
        { value: "resultado", label: "Resultado" },
        ],
    },
];

const DocumentoForm = ({
    initialData = {},
    onSubmit,
    onCancel,
    isEditing = false,
    loading = false,
    }) => {
    const [form, setForm] = useState({
        titulo: initialData.titulo || "",
        tipo: initialData.tipo || "",
    });
    const [archivo, setArchivo] = useState(null);
    const [error, setError] = useState({});

    useEffect(() => {
        setForm({
            titulo: initialData.titulo || "",
            tipo: initialData.tipo || "",
        });
        setArchivo(null);
        setError({});
    }, [initialData, isEditing]);

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
        const data = new FormData();
        data.append("titulo", form.titulo);
        data.append("tipo", form.tipo);
        if (archivo) data.append("archivo", archivo);
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
            >
            <MenuItem value="">Seleccione...</MenuItem>
            <MenuItem value="acta">Acta</MenuItem>
            <MenuItem value="comunicado">Comunicado</MenuItem>
            <MenuItem value="resultado">Resultado</MenuItem>
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

