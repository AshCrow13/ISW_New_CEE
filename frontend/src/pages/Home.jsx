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
          
        </Typography>
        <Grid container spacing={3}> 
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

