
import { useState } from 'react';
import { Container, Paper, Typography, Box, Button, Checkbox, FormControlLabel, Alert, TextField } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { postFeedback } from '../../services/feedback.service';

const FeedbackForm = ({ onSuccess }) => {
  const [comentario, setComentario] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const res = await postFeedback({ comentario, anonimo });
    if (res.status === "Success") {
      setMensaje("¡Feedback enviado!");
      setAlertSeverity("success");
      setComentario("");
      setAnonimo(false);
      if (onSuccess) onSuccess();
    } else {
      setMensaje(res.message || "Error al enviar feedback");
      setAlertSeverity("error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 7 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FeedbackIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            Enviar Feedback
          </Typography>
        </Box>
        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
          Toda opinión es importante para mejorar el centro de estudiantes. ¡Gracias por tu aporte!
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Comentario"
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            placeholder="Escribe tu comentario..."
            multiline
            minRows={4}
            maxRows={8}
            fullWidth
            required
            inputProps={{ minLength: 5, maxLength: 500 }}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={anonimo}
                onChange={e => setAnonimo(e.target.checked)}
                color="primary"
              />
            }
            label="Enviar como anónimo"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ minHeight: 48, fontWeight: 700, fontSize: 18 }}
          >
            Enviar
          </Button>
          {mensaje && (
            <Alert severity={alertSeverity} sx={{ mt: 2 }}>
              {mensaje}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default FeedbackForm;