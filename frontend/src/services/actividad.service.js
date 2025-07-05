import axios from './root.service.js';

// Obtener todas las actividades, con filtros opcionales
export async function getActividades(filtros = {}) {
    try {
        const { data } = await axios.get('/actividades', { params: filtros });
        return data.data; // ajustar respuesta al backend*********
    } catch (error) {
        return [];
    }
}

// Crear actividad
export async function createActividad(actividad) {
    try {
        const { data } = await axios.post('/actividades', actividad);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

// Editar actividad
export async function updateActividad(id, actividad) {
    try {
        const { data } = await axios.patch(`/actividades/detail?id=${id}`, actividad);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

// Eliminar actividad
export async function deleteActividad(id) {
    try {
        const { data } = await axios.delete(`/actividades/detail?id=${id}`);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}