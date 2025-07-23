import { Container, Paper, Typography, Box, Button, Grid } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import ArticleIcon from '@mui/icons-material/Article';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext'; // 

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Importa el hook useAuth para acceder al usuario autenticado
  const userRole = user?.rol; // Obtiene el rol del usuario autenticado

  return (
    <Container maxWidth="md" sx={{ py: 7 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          ¡Bienvenido al Portal del Centro de Estudiantes!
        </Typography>
        <Typography sx={{ mb: 4 }}>
          Aquí puedes gestionar actividades, consultar documentos, y revisar el historial de acciones del centro. Utiliza el menú superior para navegar.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<EventIcon />}
              onClick={() => navigate('/actividades')}
              sx={{ minHeight: 80 }}
            >
              Actividades
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<ArticleIcon />}
              onClick={() => navigate('/documentos')}
              sx={{ minHeight: 80 }}
            >
              Documentos
            </Button>
          </Grid>

          
          {(
            <Grid item xs={12}>
              <Button 
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => navigate('/feedback')}
                sx={{ minHeight: 80 }}
              >
                Enviar Feedback 
              </Button>
            </Grid>
          )}
          {(
            <Grid item xs={12}>
              <Button 
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => navigate('/votacion')}
                sx={{ minHeight: 80 }}
              >
                Votaciones
              </Button>
            </Grid>
          )}

        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;

