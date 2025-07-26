import api from './root.service.js';

// ✅ FUNCIÓN: Obtener usuarios
export const getUsers = async () => {
    try {
        const response = await api.get('/estudiantes');
        
        console.log('Response data structure:', response.data);
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            throw new Error('Estructura de respuesta inválida');
        }
    } catch (error) {
        console.error('Error en el servicio getUsers:', error);
        
        if (error.response) {
            throw new Error(`Error del servidor: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Error de conexión con el servidor');
        } else {
            throw new Error(error.message || 'Error desconocido');
        }
    }
};

// ✅ NUEVO: Obtener solo usuarios admin y vocalia (para estudiantes)
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
    } catch (error) {
        console.error('Error en el servicio getStaffUsers:', error);
        
        if (error.response) {
            throw new Error(`Error del servidor: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('Error de conexión con el servidor');
        } else {
            throw new Error(error.message || 'Error desconocido');
        }
    }
};

// ✅ CORREGIR: Actualizar usuario - Cambiar PUT por PATCH y ruta correcta
export const updateUser = async (userData, rut) => {
    try {
        console.log(' Enviando actualización:', userData, 'para RUT:', rut); // ✅ DEBUG
        
        // ✅ LIMPIAR: Remover campos no permitidos en actualización
        const { email, id, createdAt, updatedAt, rut: userRut, ...cleanUserData } = userData;
        //                                                     ^^^^^ ✅ AGREGAR: También remover rut
        
        // ✅ LIMPIAR: Remover newPassword si está vacío
        if (!cleanUserData.newPassword || cleanUserData.newPassword.trim() === '') {
            delete cleanUserData.newPassword;
        }
        
        console.log(' Datos limpios a enviar:', cleanUserData); // ✅ DEBUG
        
        // ✅ USAR: PATCH en lugar de PUT y ruta /detail
        const response = await api.patch(`/estudiantes/detail?rut=${rut}`, cleanUserData);
        
        console.log(' Respuesta del backend:', response.data); // ✅ DEBUG
        return response.data;
    } catch (error) {
        console.error(' Error en updateUser:', error); // ✅ DEBUG
        throw error;
    }
};

// ✅ FUNCIÓN: Eliminar usuario
export const deleteUser = async (rut) => {
    try {
        const response = await api.delete(`/estudiantes/detail?rut=${rut}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
};