import { useState, useContext } from 'react';
import { AuthContext } from '@context/AuthContext.jsx';
import FormularioCrearVotacion from '@components/VotacionFormularioCrear.jsx';
import MenuPrincipalVotaciones from '@components/VotacionMenu.jsx';
import ListaVotaciones from '@components/VotacionLista.jsx';
import DetalleVotacion from '@components/VotacionDetalle.jsx';
import HeaderVista from '@components/VotacionHeader.jsx';
import VistaActualizacion from '@components/VotacionVistaActualizacion.jsx';
import { 
    getVotaciones, 
    getVotacionById, 
    postVotacion, 
    updateVotacion, 
    deleteVotacion 
} from '@services/votacion.service.js';
import '@styles/votacion.css';

const Votacion = () => {
    const [view, setView] = useState(null); // null, 'crear', 'ver-todas', 'ver-una', 'actualizar', 'borrar'
    const [votaciones, setVotaciones] = useState([]);
    const [votacionSeleccionada, setVotacionSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState('');
    const { user } = useContext(AuthContext);

    // Función para obtener todas las votaciones
    const handleVerTodas = async () => {
        setLoading(true);
        setView('ver-todas');
        try {
            const data = await getVotaciones();
            console.log('📊 Datos recibidos del servicio getVotaciones:', data);
            setVotaciones(data || []);
        } catch (error) {
            console.error('Error al cargar votaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para buscar una votación específica
    const handleVerUna = async () => {
        if (!searchId) {
            alert('Por favor ingresa un ID válido');
            return;
        }
        
        setLoading(true);
        setView('ver-una');
        try {
            const data = await getVotacionById(searchId);
            if (data.status === 'Success') {
                setVotacionSeleccionada(data.data);
            } else {
                alert('Votación no encontrada');
                setVotacionSeleccionada(null);
            }
        } catch (error) {
            console.error('Error al buscar votación:', error);
            alert('Error al buscar la votación');
        } finally {
            setLoading(false);
        }
    };

    // Función para eliminar una votación
    const handleEliminar = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta votación?')) {
            return;
        }

        try {
            const resultado = await deleteVotacion(id);
            if (resultado.status === 'Success') {
                alert('✅ Votación eliminada exitosamente');
                handleVerTodas(); // Refrescar la lista
            } else {
                alert('❌ Error al eliminar: ' + (resultado.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error al eliminar votación:', error);
            alert('❌ Error al eliminar la votación');
        }
    };

    // Función para actualizar una votación
    const handleActualizar = async (id, datosActualizados) => {
        try {
            const resultado = await updateVotacion(id, datosActualizados);
            if (resultado.status === 'Success') {
                alert('✅ Votación actualizada exitosamente');
                setView(null); // Volver al menú principal
            } else {
                alert('❌ Error al actualizar: ' + (resultado.message || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error al actualizar votación:', error);
            alert('❌ Error al actualizar la votación');
        }
    };

    // Función para crear una nueva votación
    const handleCrearVotacion = async (datosVotacion) => {
        console.log('🚀 Intentando crear votación con datos:', datosVotacion);
        
        try {
            const resultado = await postVotacion(datosVotacion);
            console.log('📥 Respuesta del servidor:', resultado);
            
            if (resultado.status === 'Success') {
                alert('✅ Votación creada exitosamente');
                setView(null); // Volver al menú principal
                return { success: true };
            } else {
                console.error('❌ Error en la respuesta:', resultado);
                alert('❌ Error al crear la votación: ' + (resultado.message || 'Error desconocido'));
                return { success: false, error: resultado.message };
            }
        } catch (error) {
            console.error('💥 Error al crear votación:', error);
            alert('❌ Error al crear la votación');
            return { success: false, error: error.message };
        }
    };

    // Función para volver al menú principal
    const volverAlMenu = () => {
        setView(null);
        setVotaciones([]);
        setVotacionSeleccionada(null);
        setSearchId('');
    };

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
                    <VistaActualizacion user={user} />
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
