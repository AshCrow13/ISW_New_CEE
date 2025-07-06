import { useState } from 'react';

const ActividadForm = ({ initialData = {}, onSubmit, onCancel, isEditing = false, loading = false }) => {
  const [form, setForm] = useState({
    titulo: initialData.titulo || "",
    descripcion: initialData.descripcion || "",
    fecha: initialData.fecha || "",
    lugar: initialData.lugar || "",
    categoria: initialData.categoria || "",
    error: {},
  });
  const [charCount, setCharCount] = useState(form.descripcion.length);

  // Validación sencilla
  const validate = () => {
    let error = {};
    if (!form.titulo || form.titulo.length < 5) error.titulo = "Debe tener al menos 5 caracteres.";
    if (!form.descripcion || form.descripcion.length < 10) error.descripcion = "Debe tener al menos 10 caracteres.";
    if (!form.fecha) error.fecha = "Debe ingresar una fecha.";
    if (!form.lugar) error.lugar = "Campo obligatorio.";
    if (!form.categoria) error.categoria = "Seleccione una categoría.";
    return error;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      error: { ...prev.error, [name]: undefined }
    }));
    if (name === "descripcion") setCharCount(value.length);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setForm(prev => ({ ...prev, error: errors }));
      return;
    }
    
    const normalizado = { ...form, titulo: form.titulo.trim(), descripcion: form.descripcion.trim() };
    onSubmit(normalizado);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? "Editar Actividad" : "Nueva Actividad"}</h2>

      <label>
        Título *
        <input
          name="titulo"
          type="text"
          value={form.titulo}
          onChange={handleChange}
          placeholder="Ej: Jornada Deportiva 2024"
          minLength={5}
          maxLength={100}
          required
        />
        <small>Ejemplo: Jornada Deportiva 2024 (mínimo 5 caracteres)</small>
        {form.error.titulo && <span className="form-error">{form.error.titulo}</span>}
      </label>

      <label>
        Descripción *
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Describe la actividad. Ej: Partido amistoso entre carreras."
          minLength={10}
          maxLength={300}
          required
        />
        <small>{charCount}/300 caracteres</small>
        {form.error.descripcion && <span className="form-error">{form.error.descripcion}</span>}
      </label>

      <label>
        Fecha *
        <input
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChange}
          required
        />
        <small>Ejemplo: 2025-08-20</small>
        {form.error.fecha && <span className="form-error">{form.error.fecha}</span>}
      </label>

      <label>
        Lugar *
        <input
          name="lugar"
          type="text"
          value={form.lugar}
          onChange={handleChange}
          placeholder="Ej: Gimnasio UBB"
          required
        />
        {form.error.lugar && <span className="form-error">{form.error.lugar}</span>}
      </label>

      <label>
        Categoría *
        <select name="categoria" value={form.categoria} onChange={handleChange} required>
          <option value="">Seleccione...</option>
          <option value="Deportivo">Deportivo</option>
          <option value="Recreativo">Recreativo</option>
          <option value="Oficial">Oficial</option>
        </select>
        {form.error.categoria && <span className="form-error">{form.error.categoria}</span>}
      </label>

      <div style={{ marginTop: 16 }}>
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear"}
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ActividadForm;
