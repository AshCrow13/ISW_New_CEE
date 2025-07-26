import api from './root.service.js';

// Obtener todos los usuarios
export const getUsers = async () => {
    try {
        const response = await api.get('/estudiantes');
        
        //console.log('Response data structure:', response.data);
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
            return response.data.data; // Retorna la lista de usuarios
        } else {
            throw new Error('Estructura de respuesta inválida');
        }
    } catch (error) {
        console.error('Error en el servicio getUsers:', error);
        
        if (error.response) {
            throw new Error(`Error del servidor: ${error.response.status}`); // Manejo de error del servidor
        } else if (error.request) {
            throw new Error('Error de conexión con el servidor');
        } else {
            throw new Error(error.message || 'Error desconocido');
        }
    }
};

// Obtener un usuario por RUT
export const getStaffUsers = async () => {
    try {
        const response = await api.get('/estudiantes');
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // Filtrar solo usuarios con rol admin o vocalia
            const staffUsers = response.data.data.filter(
                user => user.rol === 'admin' || user.rol === 'vocalia'
            );
            return staffUsers;
        } else {
            throw new Error('Estructura de respuesta inválida');
        }
    } catch (error) { // Manejo de error
        // Maneja el error de manera más específica si es necesario
        console.error('Error en el servicio getStaffUsers:', error); // Manejo de error
        
        if (error.response) {
            throw new Error(`Error del servidor: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Error de conexión con el servidor');
        } else {
            throw new Error(error.message || 'Error desconocido');
        }
    }
};

export const updateUser = async (userData, rut) => {
    try {
        //console.log(' Enviando actualización:', userData, 'para RUT:', rut); 
        
        // Remover campos innecesarios
        const { email, id, createdAt, updatedAt, rut: userRut, ...cleanUserData } = userData;

        // Limpiar: Remover newPassword si está vacío
        if (!cleanUserData.newPassword || cleanUserData.newPassword.trim() === '') {
            delete cleanUserData.newPassword;
        }
        
        //console.log(' Datos limpios a enviar:', cleanUserData);
        
        // Enviar la solicitud PATCH
        const response = await api.patch(`/estudiantes/detail?rut=${rut}`, cleanUserData);
        
        //console.log(' Respuesta del backend:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error en updateUser:', error);
        throw error;
    }
};

export const deleteUser = async (rut) => {
    try {
        const response = await api.delete(`/estudiantes/detail?rut=${rut}`); // Enviar solicitud DELETE
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
};