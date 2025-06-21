// Formulario crear/editar actividad
/*
import Form from './Form';

const ActivityForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
    return (
        <Form
            title={isEdit ? "Editar Actividad" : "Nueva Actividad"}
            fields={[
                { label: "Título", name: "titulo", placeholder: "Torneo Futsal", fieldType: 'input', type: "text", required: true },
                { label: "Descripción", name: "descripcion", fieldType: 'textarea', required: true, minLength: 10, maxLength: 300 },
                { label: "Fecha", name: "fecha", fieldType: 'input', type: "date", required: true },
                { label: "Lugar", name: "lugar", fieldType: 'input', type: "text", required: true },
                { label: "Categoría", name: "categoria", fieldType: 'select', options: [
                    { value: 'Deportivo', label: 'Deportivo' },
                    { value: 'Recreativo', label: 'Recreativo' }
                ], required: true },
                { label: "Responsable", name: "responsable", fieldType: 'input', type: "text", required: true },
                { label: "Recursos", name: "recursos", fieldType: 'input', type: "text", required: false },
            ]}
            buttonText={isEdit ? "Actualizar" : "Crear"}
            onSubmit={onSubmit}
        />
    );
};

export default ActivityForm;
*/