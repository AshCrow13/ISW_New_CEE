import axios from './root.service.js';
import { jwtDecode } from 'jwt-decode';
import { convertirMinusculas } from '@helpers/formatData.js';

export async function login(dataUser) {
    try {
        const response = await axios.post('/auth/login', {
            email: dataUser.email, 
            password: dataUser.password
        });
        const { status, data } = response;
        if (status === 200) {
            const { nombreCompleto, email, rut, rol, carrera } = jwtDecode(data.data.token);
            const userData = { nombreCompleto, email, rut, rol, carrera };
            sessionStorage.setItem('usuario', JSON.stringify(userData));
            
            const token = data.data.token;
            
            console.log('🔍 LOGIN DEBUG:');
            console.log('Token recibido:', token ? 'SÍ' : 'NO');
            console.log('Token (primeros 20 chars):', token.substring(0, 20) + '...');
            
            // ✅ USAR SOLO LOCALSTORAGE (las cookies no funcionan)
            localStorage.setItem('jwt-auth', token);
            
            // Verificar que se guardó correctamente
            const savedToken = localStorage.getItem('jwt-auth');
            console.log('Token guardado en localStorage:', savedToken ? 'SÍ' : 'NO');
            console.log('¿Son iguales?:', token === savedToken);
            
            // ✅ CONFIGURAR EN HEADERS INMEDIATAMENTE
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            console.log('✅ Token configurado exitosamente en localStorage y headers');
            return response.data;
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else if (error.request) {
            return { status: "Network Error", message: "No hay respuesta del servidor." };
        } else {
            return { status: "Client Error", message: error.message || "Error desconocido." };
        }
    }
}

export async function register(data) {
    try {
        const dataRegister = convertirMinusculas(data);
        const { nombreCompleto, email, rut, password } = dataRegister;
        const response = await axios.post('/auth/register', {
            nombreCompleto,
            email,
            rut,
            password
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else if (error.request) {
            return { status: "Network Error", message: "No hay respuesta del servidor." };
        } else {
            return { status: "Client Error", message: error.message || "Error desconocido." };
        }
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        localStorage.removeItem('jwt-auth');
        delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}