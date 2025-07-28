import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormHelperText,
  Paper, 
  Grid, 
  Divider, 
  InputAdornment,
  Card,
  CardContent
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const ActividadForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
}) => {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    lugar: "",
    categoria: "",
    responsableId: 1, 
    recursos: "",
    estado: "publicada",
    error: {},
  });
  
  const [charCount, setCharCount] = useState(form.descripcion.length);
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    // Si hay fecha en los datos iniciales, separarla en fecha y hora
    let fechaValue = "";
    let horaValue = "";
    
    if (initialData.fecha) { // Asegurarse de que initialData.fecha no sea undefined
      const fechaObj = new Date(initialData.fecha);
      if (!isNaN(fechaObj.getTime())) {
        // Formato YYYY-MM-DD para el input date
        fechaValue = fechaObj.toISOString().slice(0, 10);
        // Formato HH:MM para el input time
        horaValue = fechaObj.toTimeString().slice(0, 5);
      }
    }
    
    setForm({ // Inicializar el formulario con los datos
        titulo: initialData.titulo || "",
        descripcion: initialData.descripcion || "",
        fecha: fechaValue,
        hora: horaValue,
        lugar: initialData.lugar || "",
        categoria: initialData.categoria || "",
        responsableId: initialData.responsableId || 1,
        recursos: initialData.recursos || "",
        estado: initialData.estado || "publicada",
        error: {},
    });
    setCharCount(initialData.descripcion?.length || 0);
  }, [initialData]);

  const validate = () => { // Validación de los campos del formulario
    let error = {};
    if (!form.titulo || form.titulo.length < 5) error.titulo = "Debe tener al menos 5 caracteres.";
    if (!form.descripcion || form.descripcion.length < 10) error.descripcion = "Debe tener al menos 10 caracteres.";
    if (!form.fecha) error.fecha = "Debe ingresar una fecha.";
    if (!form.hora) error.hora = "Debe ingresar una hora.";
    if (!form.lugar) error.lugar = "Campo obligatorio.";
    if (!form.categoria) error.categoria = "Seleccione una categoría.";
    if (!form.responsableId) error.responsableId = "Debe seleccionar un responsable.";

    // Validar que la fecha no sea anterior a hoy al editar
    if (isEditing && form.fecha) {
      const hoy = new Date();
      hoy.setHours(0,0,0,0);
      const fechaActividad = new Date(form.fecha);
      if (fechaActividad < hoy) {
        error.fecha = "La fecha de la actividad debe ser posterior o igual a la fecha actual.";
      }
    }
    return error;
  };

  const handleChange = e => { // Manejar cambios en los campos del formulario
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev, // Actualizar el estado del formulario
      [name]: value, // Actualizar el campo correspondiente
      error: { ...prev.error, [name]: undefined }
    }));
    if (name === "descripcion") setCharCount(value.length);
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
    // tipo/tamaño
  };

  const handleSubmit = e => { // Manejar el envío del formulario
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setForm(prev => ({ ...prev, error: errors })); // Actualizar el estado con los errores
      return;
    }

    // Combinar fecha y hora en un solo campo ISO
    const fechaHora = `${form.fecha}T${form.hora}:00`;

    // Usar FormData si hay archivo
    let dataToSend;
    if (archivo) {
      dataToSend = new FormData();
      dataToSend.append('titulo', form.titulo.trim());
      dataToSend.append('descripcion', form.descripcion.trim());
      dataToSend.append('fecha', fechaHora);
      dataToSend.append('lugar', form.lugar.trim());
      dataToSend.append('categoria', form.categoria);
      dataToSend.append('responsableId', String(form.responsableId)); // Asegurarse de enviar como string
      dataToSend.append('recursos', form.recursos || "");
      dataToSend.append('estado', form.estado || "publicada");
      dataToSend.append('archivo', archivo);
    } else {
      dataToSend = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        fecha: fechaHora,
        lugar: form.lugar.trim(),
        categoria: form.categoria,
        responsableId: form.responsableId,
        recursos: form.recursos || "",
        estado: form.estado || "publicada"
      };
    }

    onSubmit(dataToSend);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Card elevation={0} sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EventIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
            <Typography variant="h5" component="h2">
              {isEditing ? "Editar Actividad" : "Nueva Actividad"}
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          {/* Sección de información básica */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'text.secondary' }}>
            Información Básica
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título *"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej: Jornada Deportiva 2024"
                variant="outlined"
                error={!!form.error.titulo}
                helperText={form.error.titulo || "Ingresa un título descriptivo de al menos 5 caracteres"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción *"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe la actividad. Ej: Partido amistoso entre carreras."
                variant="outlined"
                error={!!form.error.descripcion}
                helperText={form.error.descripcion || `${charCount}/300 caracteres`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <DescriptionIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          
          {/* Sección de fecha y lugar */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'text.secondary' }}>
            Fecha y Ubicación
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha *"
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={!!form.error.fecha}
                helperText={form.error.fecha}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hora *"
                name="hora"
                type="time"
                value={form.hora}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={!!form.error.hora}
                helperText={form.error.hora}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lugar *"
                name="lugar"
                value={form.lugar}
                onChange={handleChange}
                placeholder="Ej: Gimnasio UBB"
                variant="outlined"
                error={!!form.error.lugar}
                helperText={form.error.lugar}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!form.error.categoria} variant="outlined">
                <InputLabel id="categoria-label">Categoría *</InputLabel>
                <Select
                  labelId="categoria-label"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  label="Categoría *"
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Seleccione...</MenuItem>
                  <MenuItem value="Deportivo">Deportivo</MenuItem>
                  <MenuItem value="Recreativo">Recreativo</MenuItem>
                  <MenuItem value="Oficial">Oficial</MenuItem>
                </Select>
                {form.error.categoria && <FormHelperText>{form.error.categoria}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>

          {/* Campo para subir archivo */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
              color={archivo ? "success" : "primary"}
            >
              {archivo ? archivo.name : "Adjuntar documento (opcional)"}
              <input type="file" hidden name="archivo" onChange={handleFileChange} />
            </Button>
          </Grid>

          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ 
                borderRadius: 2,
                px: 4,
                '&:hover': {
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }
              }}
            >
              {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Actividad"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActividadForm;
