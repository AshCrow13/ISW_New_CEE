import axios from './root.service.js';

// Registrar asistencia
export async function registrarAsistencia(asistenciaData) {
    try {
        const { data } = await axios.post('/asistencia', asistenciaData);
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al registrar asistencia' };
    }
}

// Obtener asistencias de una instancia
export async function getAsistenciasInstancia(idInstancia) {
    try {
        const { data } = await axios.get('/asistencia', { 
            params: { idInstancia } 
        });
        return data.data;
    } catch (error) {
        return [];
    }
}

// Verificar si un usuario ya registró asistencia
export async function verificarAsistencia(rut, idInstancia) {
    try {
        const { data } = await axios.get('/asistencia/detail', { 
            params: { rut, idInstancia } 
        });
        return data.data;
    } catch (error) {
        return null;
    }
} 