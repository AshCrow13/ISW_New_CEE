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

// Obtener próximas actividades (las 7 más cercanas)
export async function getProximasActividades(cantidad = 7) {
    try {
        // Obtener la fecha actual en formato ISO
        const hoy = new Date().toISOString().split('T')[0];
        
        // Parámetros para filtrar por fecha posterior a hoy y limitar cantidad
        const params = {
            fechaInicio: hoy,
            limit: cantidad,
            orderBy: 'fecha_asc' // Ordenadas por fecha ascendente (las más próximas primero)
        };
        
        const { data } = await axios.get('/actividades', { params });
        return data.data;
    } catch (error) {
        console.error('Error al obtener próximas actividades:', error);
        return [];
    }
}

// Crear actividad
export async function createActividad(actividad) {
    try { // Validar que la actividad tenga los campos necesarios
        const { data } = await axios.post('/actividades', actividad);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

// Editar actividad
export async function updateActividad(id, actividad) {
    try { // Validar que la actividad tenga los campos necesarios
        const { data } = await axios.patch(`/actividades/detail?id=${id}`, actividad);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

// Eliminar actividad
export async function deleteActividad(id) {
    try { // Validar que el ID sea válido
        const { data } = await axios.delete(`/actividades/detail?id=${id}`);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}