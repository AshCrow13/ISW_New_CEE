import axios from "./root.service.js";

export async function getVotacionConteo(votacionId) {
    try {
        const response = await axios.get(`/votar/${votacionId}/conteo`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener votaciones:", error);
        return [];
    }
}

export async function getVotacionVotos(votacionId) {
    try {
        const response = await axios.get(`/votar/${votacionId}/votos`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener votación con ID ${id}:`, error);
        return error.response?.data || { status: 'Error', message: 'Error al obtener la votación' };
    }
}
// Servicio para registrar un voto
export async function postVoto({ votacionId, opcionId }) {
    try {
        const response = await axios.post(`/votar/${votacionId}/${opcionId}`);
        return response.data;
    } catch (error) {
        console.error("Error al registrar voto:", error);
        return error.response?.data || { status: 'Error', message: 'Error al registrar el voto' };
    }
}