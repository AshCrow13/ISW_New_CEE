import axios from './root.service.js';

export async function getDocumentos(filtros = {}) { // Aquí filtros es un objeto con los parámetros de búsqueda
    try {
        const { data } = await axios.get('/documentos', { params: filtros });
        return data.data;
    } catch (error) {
        return [];
    }
}

export async function createDocumento(formData) { // Aquí formData es un objeto FormData con los campos del formulario
    try { // Aquí formData       
        const { data } = await axios.post('/documentos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

export async function updateDocumento(id, fields) { // Aquí id es el ID del documento y fields es un objeto con los campos a actualizar
    try { // Aquí fields es un objeto con los campos a actualizar
        const { data } = await axios.patch(`/documentos/detail?id=${id}`, fields);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

export async function deleteDocumento(id) { // Aquí id es el ID del documento a eliminar
    try {
        const { data } = await axios.delete(`/documentos/detail?id=${id}`);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

export async function downloadDocumento(id) { // Aquí id es el ID del documento a descargar
    try {
        const response = await axios.get(`/documentos/download/${id}`, {
        responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}
