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
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
          Representando a la comunidad estudiantil con compromiso y transparencia
        </Typography>
        <Typography sx={{ mb: 4, textAlign: 'justify' }}>
          Somos la voz oficial de los estudiantes, trabajando incansablemente para mejorar la calidad 
          educativa, promover actividades extracurriculares y crear un ambiente universitario que 
          fomente el crecimiento académico y personal de toda nuestra comunidad estudiantil.
        </Typography>

        {/* Sección de Objetivos */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
            Nuestros Objetivos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <GroupIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Representación Estudiantil
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ser la voz auténtica de todos los estudiantes ante las autoridades académicas
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <EventIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Actividades y Eventos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Organizar eventos culturales, deportivos y académicos que enriquezcan la experiencia universitaria
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <ArticleIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Gestión Transparente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mantener procesos democráticos y transparentes en todas nuestras decisiones
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <HistoryIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Mejora Continua
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trabajar constantemente por mejorar las condiciones académicas y el bienestar estudiantil
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* Mensaje de bienvenida personalizado */}
        {user && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'primary.contrastText' }}>
              ¡Hola, {user.nombreCompleto}!
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.contrastText' }}>
              Gracias por ser parte activa de nuestra comunidad estudiantil. 
              Tu participación es fundamental para construir un mejor ambiente universitario.
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>

        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;

