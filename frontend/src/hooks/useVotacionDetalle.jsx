
import { useState, useEffect } from 'react';
import { getVotacionConteo, getVotacionVotos } from '@services/votar.service.js';

// Hook para manejar la lógica de presentación de detalles de votación
export function useVotacionDetalle({ votacionSeleccionada, user, handleEliminar }) {
    const [conteo, setConteo] = useState([]);
    const [votos, setVotos] = useState([]);
    const [loadingResultados, setLoadingResultados] = useState(false);
    const [errorResultados, setErrorResultados] = useState(null);

    useEffect(() => {
        if (votacionSeleccionada && votacionSeleccionada.estado === false) {
            setLoadingResultados(true);
            setErrorResultados(null);
            Promise.all([
                getVotacionConteo(votacionSeleccionada.id),
                getVotacionVotos(votacionSeleccionada.id)
            ])
                .then(([conteoRes, votosRes]) => {
                    setConteo(conteoRes || []);
                    setVotos(votosRes?.data || []);
                })
                .catch((err) => {
                    setErrorResultados('Error al cargar resultados');
                })
                .finally(() => setLoadingResultados(false));
        } else {
            setConteo([]);
            setVotos([]);
        }
    }, [votacionSeleccionada]);

    return {
        votacionSeleccionada,
        user,
        handleEliminar,
        conteo,
        votos,
        loadingResultados,
        errorResultados
    };
}
