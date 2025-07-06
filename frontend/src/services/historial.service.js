import axios from './root.service.js';

// Obtener historial **FALTAN FILTROS***
export async function getHistorial(filtros = {}) { // Filtros opcionales para la consulta
    try {
        const { data } = await axios.get('/historial', { params: filtros });
        return data.data; // Ajustar segun respuesta del backend
    } catch (error) {
        return [];
    }
}
