import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext.jsx';
import FormularioCrearVotacion from '@components/VotacionFormularioCrear.jsx';
import MenuPrincipalVotaciones from '@components/VotacionMenu.jsx';
import ListaVotaciones from '@components/VotacionLista.jsx';
import DetalleVotacion from '@components/VotacionDetalle.jsx';
import HeaderVista from '@components/VotacionHeader.jsx';
import VistaActualizacion from '@components/VotacionVistaActualizacion.jsx';
import useVotaciones from '@hooks/useVotaciones.jsx';
import '@styles/votacion.css';

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
        volverAlMenu
    } = useVotaciones();

    return (
        <div className="votacion-container">
            <h1 className="votacion-title">Gestión de Votaciones</h1>

            {/* Menú principal */}
            {view === null && (
                <MenuPrincipalVotaciones
                    user={user}
                    searchId={searchId}
                    setSearchId={setSearchId}
                    setView={setView}
                    handleVerTodas={handleVerTodas}
                    handleVerUna={handleVerUna}
                />
            )}

            {/* Vista de crear votación */}
            {view === 'crear' && (
                <div className="content-container">
                    <HeaderVista titulo="Nueva Votación" volverAlMenu={volverAlMenu} />
                    <FormularioCrearVotacion 
                        onSubmit={handleCrearVotacion}
                        onSuccess={volverAlMenu} 
                        onCancel={volverAlMenu} 
                    />
                </div>
            )}

            {/* Vista de todas las votaciones */}
            {view === 'ver-todas' && (
                <div className="content-container">
                    <HeaderVista titulo="Todas las Votaciones" volverAlMenu={volverAlMenu} />
                    <ListaVotaciones
                        votaciones={votaciones}
                        loading={loading}
                        user={user}
                        handleEliminar={handleEliminar}
                    />
                </div>
            )}

            {/* Vista de detalle de votación */}
            {view === 'ver-una' && (
                <div className="content-container">
                    <HeaderVista titulo="Detalle de Votación" volverAlMenu={volverAlMenu} />
                    <DetalleVotacion
                        votacionSeleccionada={votacionSeleccionada}
                        loading={loading}
                        user={user}
                        handleEliminar={handleEliminar}
                    />
                </div>
            )}

            {/* Vista de actualización */}
            {view === 'actualizar' && (
                <div className="content-container">
                    <HeaderVista titulo="Actualizar Votación" volverAlMenu={volverAlMenu} />
                    <VistaActualizacion 
                        user={user} 
                        onActualizar={handleActualizar}
                    />
                </div>
            )}

            {/* Botón flotante para volver al menú */}
            {view !== null && (
                <button
                    onClick={volverAlMenu}
                    className="btn-floating"
                    title="Volver al menú principal"
                >
                    🏠
                </button>
            )}
        </div>
    );
};

export default Votacion;
