
import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext.jsx';
import FormularioCrearVotacion from '@components/VotacionFormularioCrear.jsx';
import MenuPrincipalVotaciones from '@components/VotacionMenu.jsx';
import ListaVotaciones from '@components/VotacionLista.jsx';
import DetalleVotacion from '@components/VotacionDetalle.jsx';
import HeaderVista from '@components/VotacionHeader.jsx';
import VistaActualizacion from '@components/VotacionVistaActualizacion.jsx';
import useVotaciones from '@hooks/useVotaciones.jsx';
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
        searchId,
        setSearchId,
        handleVerTodas,
        handleVerUna,
        handleEliminar,
        handleActualizar,
        handleCrearVotacion,
        handleVotar,
        volverAlMenu
    } = useVotaciones();

    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <HowToVoteIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" color="primary.main" fontWeight={700}>
              Gestión de Votaciones
            </Typography>
          </Box>

          <Fade in={view === null} unmountOnExit>
            <Box>
              <MenuPrincipalVotaciones
                user={user}
                searchId={searchId}
                setSearchId={setSearchId}
                setView={setView}
                handleVerTodas={handleVerTodas}
                handleVerUna={handleVerUna}
              />
            </Box>
          </Fade>

          <Fade in={view === 'crear'} unmountOnExit>
            <Box>
              <HeaderVista titulo="Nueva Votación" volverAlMenu={volverAlMenu} />
              <FormularioCrearVotacion
                onSubmit={handleCrearVotacion}
                onSuccess={volverAlMenu}
                onCancel={volverAlMenu}
              />
            </Box>
          </Fade>

          <Fade in={view === 'ver-todas'} unmountOnExit>
            <Box>
              <HeaderVista titulo="Todas las Votaciones" volverAlMenu={volverAlMenu} />
              <ListaVotaciones
                votaciones={votaciones}
                loading={loading}
                user={user}
                handleEliminar={handleEliminar}
              />
            </Box>
          </Fade>

          <Fade in={view === 'ver-una'} unmountOnExit>
            <Box>
              <HeaderVista titulo="Detalle de Votación" volverAlMenu={volverAlMenu} />
              <DetalleVotacion
                votacionSeleccionada={votacionSeleccionada}
                loading={loading}
                user={user}
                handleEliminar={handleEliminar}
                handleVotar={handleVotar}
              />
            </Box>
          </Fade>

          <Fade in={view === 'actualizar'} unmountOnExit>
            <Box>
              <HeaderVista titulo="Actualizar Votación" volverAlMenu={volverAlMenu} />
              <VistaActualizacion
                user={user}
                onActualizar={handleActualizar}
              />
            </Box>
          </Fade>
        </Paper>
      </Container>
    );
};

export default Votacion;
