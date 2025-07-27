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
    try {
        console.log("Llamando a createDocumento:", formData);
        const { data } = await axios.post('/documentos', formData, { // Enviamos formData directamente
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    } catch (error) { // Aquí manejamos errores específicos de la creación del documento
        console.error("Error en createDocumento:", error.response?.data || error);
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

export async function updateDocumento(id, fields) { // Aquí id es el ID del documento y fields es un objeto con los campos a actualizar
    try {
        // Verificar que id sea un número válido antes de hacer la petición
        if (!id || isNaN(parseInt(id))) {
            throw { message: 'ID no válido para actualización de documento' };
        }
        
        console.log(`Llamando a updateDocumento con ID: ${id}`, fields); // Log para depuración
        const { data } = await axios.patch(`/documentos/detail?id=${id}`, fields); // Enviamos los campos a actualizar
        return data; // Retornamos la respuesta del servidor
    } catch (error) {
        console.error("Error en updateDocumento:", error.response?.data || error);
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

export async function deleteDocumento(id) { // Aquí id es el ID del documento a eliminar
    try {
        const { data } = await axios.delete(`/documentos/detail?id=${id}`); // Enviamos el ID del documento a eliminar
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}

export async function downloadDocumento(id) { // Aquí id es el ID del documento a descargar
    try {
        const response = await axios.get(`/documentos/download/${id}`, { // Enviamos el ID del documento a descargar
        responseType: 'blob' // Aseguramos que la respuesta sea un blob para descargar archivos
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' };
    }
}
