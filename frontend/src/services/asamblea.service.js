import axios from './root.service.js';

// Obtener todas las asambleas, con filtros opcionales
export async function getAsambleas(filtros = {}) {
    try {
        const { data } = await axios.get('/asamblea', { params: filtros });
        return data.data;
    } catch (error) {
        return [];
    }
}

// Crear asamblea
export async function createAsamblea(asamblea) {
    try {
        const { data } = await axios.post('/asamblea', asamblea);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al crear asamblea' };
    }
}

// Editar asamblea
export async function updateAsamblea(id, asamblea) {
    try {
        const { data } = await axios.patch(`/asamblea/detail?id=${id}`, asamblea);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al editar asamblea' };
    }
}

// Eliminar asamblea
export async function deleteAsamblea(id) {
    try {
        const { data } = await axios.delete(`/asamblea/detail?id=${id}`);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error eliminar asamblea' };
    }
} 