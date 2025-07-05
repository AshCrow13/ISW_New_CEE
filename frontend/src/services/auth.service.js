import axios from './root.service.js';
import cookies from 'js-cookie';
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
            const { nombreCompleto, email, rut, rol } = jwtDecode(data.data.token);
            const userData = { nombreCompleto, email, rut, rol };
            sessionStorage.setItem('usuario', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            cookies.set('jwt-auth', data.data.token, {path:'/'});
            return response.data
        }
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else if (error.request) {
            // El backend no respondió, pero la petición fue enviada
            return { status: "Network Error", message: "No hay respuesta del servidor." };
        } else {
            // Error inesperado en el código frontend
            return { status: "Client Error", message: error.message || "Error desconocido." };
        }
    }
}

export async function register(data) {
    try {
        const dataRegister = convertirMinusculas(data);
        const { nombreCompleto, email, rut, password } = dataRegister
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
            // El backend no respondió, pero la petición fue enviada
            return { status: "Network Error", message: "No hay respuesta del servidor." };
        } else {
            // Error inesperado en el código frontend
            return { status: "Client Error", message: error.message || "Error desconocido." };
        }
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}