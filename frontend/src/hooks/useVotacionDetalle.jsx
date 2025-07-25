
import { useState, useEffect } from 'react';
import { getVotacionConteo, getVotacionVotos } from '@services/votar.service.js';

// Hook para manejar la lógica de presentación de detalles de votación
export function useVotacionDetalle({ votacionSeleccionada, user, handleEliminar }) {
    const [conteo, setConteo] = useState({});
    const [votos, setVotos] = useState([]);
    const [loadingResultados, setLoadingResultados] = useState(false);
    const [errorResultados, setErrorResultados] = useState(null);

    useEffect(() => {
        if (votacionSeleccionada) {
            // Determinar si la votación está cerrada
            const ahora = new Date();
            const fin = new Date(votacionSeleccionada.fin);
            const votacionCerrada = ahora > fin || votacionSeleccionada.estado === false;

            // Solo cargar resultados si la votación está cerrada
            if (votacionCerrada) {
                setLoadingResultados(true);
                setErrorResultados(null);
                Promise.all([
                    getVotacionConteo(votacionSeleccionada.id),
                    getVotacionVotos(votacionSeleccionada.id)
                ])
                    .then(([conteoRes, votosRes]) => {
                        // Convertir array de conteo a objeto para fácil acceso
                        const conteoObj = {};
                        if (Array.isArray(conteoRes)) {
                            conteoRes.forEach(item => {
                                // El backend devuelve {opcionId: "8", conteo: "3"}
                                conteoObj[item.opcionId] = parseInt(item.conteo);
                            });
                        }
                        
                        setConteo(conteoObj);
                        setVotos(votosRes?.data || []);
                    })
                    .catch((err) => {
                        console.error('Error al cargar resultados:', err);
                        setErrorResultados('Error al cargar resultados');
                    })
                    .finally(() => setLoadingResultados(false));
            } else {
                // Si la votación no está cerrada, limpiar resultados
                setConteo({});
                setVotos([]);
                setLoadingResultados(false);
                setErrorResultados(null);
            }
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
