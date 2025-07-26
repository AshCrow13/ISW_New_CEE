import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext.jsx';
import FormularioCrearVotacion from '@components/votacion/VotacionFormularioCrear.jsx';
import VotacionTabla from '@components/votacion/VotacionTabla.jsx';
import VotacionDetalleNuevo from '@components/votacion/VotacionDetalleNuevo.jsx';
import VotacionEditar from '@components/votacion/VotacionEditar.jsx';
import VotacionHeader from '@components/votacion/VotacionHeader.jsx';
import useVotaciones from '@hooks/votacion/useVotaciones.jsx';
import { Container, Paper, Typography, Box, Fade } from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

const Votacion = () => {
    const { user } = useContext(AuthContext);
    const {
        view,
        setView,
        votaciones,
        votacionSeleccionada,
        loading,
        verDetalle,
        irAEditar,
        handleEliminar,
        handleActualizar,
        handleCrearVotacion,
        handleVotar,
        volverAlMenu
    } = useVotaciones();

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, minHeight: '80vh' }}>
          {/* Header principal - solo se muestra en vista tabla */}
          {view === 'tabla' && (
            <Box display="flex" alignItems="center" mb={4}>
              <HowToVoteIcon color="primary" sx={{ fontSize: 48, mr: 2 }} />
              <Typography variant="h3" color="primary.main" fontWeight={700}>
                Centro de Votaciones
              </Typography>
            </Box>
          )}

          {/* Vista de tabla principal */}
          <Fade in={view === 'tabla'} unmountOnExit>
            <Box>
              <VotacionTabla
                votaciones={votaciones}
                loading={loading}
                user={user}
                onVerDetalle={verDetalle}
                onEditar={irAEditar}
                onEliminar={handleEliminar}
                onCrearNueva={() => setView('crear')}
              />
            </Box>
          </Fade>

          {/* Vista de crear nueva votación */}
          <Fade in={view === 'crear'} unmountOnExit>
            <Box>
              <VotacionHeader titulo="Nueva Votación" volverAlMenu={volverAlMenu} />
              <FormularioCrearVotacion
                onSubmit={handleCrearVotacion}
                onSuccess={volverAlMenu}
                onCancel={volverAlMenu}
              />
            </Box>
          </Fade>

          {/* Vista de detalle de votación */}
          <Fade in={view === 'detalle'} unmountOnExit>
            <Box>
              <VotacionDetalleNuevo
                votacionSeleccionada={votacionSeleccionada}
                loading={loading}
                user={user}
                onVolver={volverAlMenu}
                handleVotar={handleVotar}
              />
            </Box>
          </Fade>

          {/* Vista de edición */}
          <Fade in={view === 'editar'} unmountOnExit>
            <Box>
              <VotacionEditar
                votacion={votacionSeleccionada}
                onVolver={volverAlMenu}
                onGuardar={handleActualizar}
                loading={loading}
              />
            </Box>
          </Fade>
        </Paper>
      </Container>
    );
};

export default Votacion;
