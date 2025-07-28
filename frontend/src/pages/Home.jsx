import { Paper, Typography, Box, Grid } from '@mui/material';
import { 
    Event as EventIcon,
    Article as ArticleIcon,
    Group as GroupIcon,
    History as HistoryIcon,
    Home as HomeIcon
} from '@mui/icons-material';
import { useAuth } from '@context/AuthContext';
import PageContainer from '@components/common/PageContainer';
import PageHeader from '@components/common/PageHeader';

const Home = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title="¡Bienvenido al Portal del Centro de Estudiantes!"
        subtitle="Representando a la comunidad estudiantil con compromiso y transparencia"
        icon={<HomeIcon />}
        breadcrumbs={[
          { label: 'Inicio' }
        ]}
      />
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Typography sx={{ mb: 4, textAlign: 'justify', fontSize: '1.1rem' }}>
          Somos la voz oficial de los estudiantes, trabajando incansablemente para mejorar la calidad 
          educativa, promover actividades extracurriculares y crear un ambiente universitario que 
          fomente el crecimiento académico y personal de toda nuestra comunidad estudiantil.
        </Typography>

        {/* Sección de Objetivos */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            Nuestros Objetivos
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <GroupIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Representación Estudiantil
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ser la voz unificada de todos los estudiantes ante las autoridades académicas
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <EventIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Actividades y Eventos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Organizar eventos que enriquezcan la experiencia universitaria y fomenten la integración
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <ArticleIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Transparencia
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mantener informada a la comunidad estudiantil sobre nuestras gestiones y decisiones
                  </Typography>
                </Box>
              </Box>
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
      </Paper>
    </PageContainer>
  );
};

export default Home;
