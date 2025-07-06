import { useState } from "react";

const defaultFields = [
    { label: 'Título', name: 'titulo', fieldType: 'input', type: 'text', required: true, minLength: 5, maxLength: 100 },
    { label: 'Tipo', name: 'tipo', fieldType: 'select', required: true, options: [
        { value: 'acta', label: 'Acta' },
        { value: 'comunicado', label: 'Comunicado' },
        { value: 'resultado', label: 'Resultado' }
    ]
    },
  // Agregar aqui otros los campos
];

const DocumentoForm = ({ 
    initialData = {},
    onSubmit,
    onCancel,
    isEditing = false,
    loading = false
    }) => {
    const [archivo, setArchivo] = useState(null);
    const [fields, setFields] = useState(defaultFields);

    const handleChange = (e) => { // Captura el archivo seleccionado
        setArchivo(e.target.files[0]);
    };

    const handleSubmit = (e) => { // Maneja el envío del formulario
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        if (archivo) data.append('archivo', archivo);
        onSubmit(data);
    };

    return ( // Renderiza el formulario
        <form onSubmit={handleSubmit}>
        <h2>{isEditing ? "Editar Documento" : "Nuevo Documento"}</h2>
        {fields.map((field) => (
            <div key={field.name} style={{ marginBottom: 10 }}>
            <label>{field.label}</label>
            {field.fieldType === 'input' && (
                <input
                name={field.name}
                type={field.type}
                defaultValue={initialData[field.name] || ""}
                required={field.required}
                minLength={field.minLength}
                maxLength={field.maxLength}
                />
            )}
            {field.fieldType === 'select' && ( // Renderiza un campo de selección
                <select name={field.name} defaultValue={initialData[field.name] || ""} required={field.required}>
                <option value="">Seleccione...</option>
                {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                </select>
            )}
            </div>
        ))}
        <div style={{ marginBottom: 10 }}>
            <label>Archivo adjunto</label>
            <input type="file" name="archivo" onChange={handleChange} required={!isEditing} />
        </div>
        <button type="submit" disabled={loading}>{isEditing ? "Guardar Cambios" : "Crear"}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>Cancelar</button>
        </form>
    );
};

export default DocumentoForm;
