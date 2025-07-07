import axios from './root.service.js';
import { formatUserData } from '@helpers/formatData.js';

export async function getUsers() {
    try {
        // ✅ Usar la ruta correcta
        const { data } = await axios.get('/estudiantes');
        
        console.log('Response data structure:', data);
        
        if (data && data.data && Array.isArray(data.data)) {
            const formattedData = data.data.map(formatUserData);
            return formattedData;
        } else {
            throw new Error('Estructura de respuesta inválida');
        }
    } catch (error) {
        console.error('Error in getUsers service:', error);
        
        if (error.response) {
            throw new Error(`Error del servidor: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Error de conexión con el servidor');
        } else {
            throw new Error(error.message || 'Error desconocido');
        }
    }
}

export async function updateUser(data, rut) {
    try {
        // ✅ Actualizar con la ruta correcta
        const response = await axios.patch(`/estudiantes/detail/?rut=${rut}`, data);
        console.log(response);
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
}

export async function deleteUser(rut) {
    try {
        // ✅ Actualizar con la ruta correcta
        const response = await axios.delete(`/estudiantes/detail/?rut=${rut}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
}