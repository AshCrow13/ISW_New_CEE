import axios from "./root.service.js";

export async function getVotaciones() {
    try {
        const response = await axios.get("/votacion/Todas");
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener votaciones:", error);
        return [];
    }
}

export async function getVotacionById(id) {
    try {
        const response = await axios.get(`/votacion/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener votación con ID ${id}:`, error);
        return error.response?.data || { status: 'Error', message: 'Error al obtener la votación' };
    }
}

export async function postVotacion(data) {
    try {
        const response = await axios.post("/votacion", data);
        return response.data;
    } catch (error) {
        console.error("Error al crear votación:", error);
        return error.response?.data || { status: 'Error', message: 'Error al crear la votación' };
    }
}

export async function updateVotacion(id, data) {
    try {
        const response = await axios.put(`/votacion/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar votación con ID ${id}:`, error);
        return error.response?.data || { status: 'Error', message: 'Error al actualizar la votación' };
    }
}

export async function deleteVotacion(id) {
    try {
        const response = await axios.delete(`/votacion/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar votación con ID ${id}:`, error);
        return error.response?.data || { status: 'Error', message: 'Error al eliminar la votación' };
    }
}

