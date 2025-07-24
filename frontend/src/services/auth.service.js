import axios from './root.service.js';
import { jwtDecode } from 'jwt-decode';
import { convertirMinusculas } from '@helpers/formatData.js';
import { formatRutOnChange } from '@helpers/formatRut.js';

export async function login(dataUser) {
    try {
        // Validaciones preliminares en el cliente
        if (dataUser.email && (!dataUser.email.includes('@') || !dataUser.email.match(/@(alumnos\.)?ubiobio\.cl$/))) {
            return { 
                status: 'Error', 
                dataInfo: 'email',
                message: 'Debe ingresar un correo institucional válido'
            };
        }
        
        const rutRegex = /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/;
        if (dataUser.rut && !rutRegex.test(dataUser.rut)) {
            // Intentar formatear el RUT si no está en el formato correcto
            const formattedRut = formatRutOnChange(dataUser.rut);
            if (!rutRegex.test(formattedRut)) {
                return { 
                    status: 'Error', 
                    dataInfo: 'rut',
                    message: 'El RUT debe tener formato xx.xxx.xxx-x'
                };
            }
            // Si el formateo tuvo éxito, usar el RUT formateado
            dataUser.rut = formattedRut;
        }

        if (!dataUser.password || dataUser.password.length < 8) {
            return {
                status: 'Error',
                dataInfo: 'password',
                message: 'Error en la contraseña, rut o correo electrónico.'
            };
        }

        // Soportar login por email o RUT
        const loginData = {
            ...(dataUser.email && { email: dataUser.email }),
            ...(dataUser.rut && { rut: dataUser.rut }),
            password: dataUser.password
        };

        const response = await axios.post('/auth/login', loginData);
        const { status, data } = response;
        if (status === 200) {
            const { nombreCompleto, email, rut, rol, carrera } = jwtDecode(data.data.token);
            const userData = { nombreCompleto, email, rut, rol, carrera };
            sessionStorage.setItem('usuario', JSON.stringify(userData));
            
            const token = data.data.token;
            
            // ✅ USAR SOLO LOCALSTORAGE (las cookies no funcionan)
            localStorage.setItem('jwt-auth', token);
            
            // Verificar que se guardó correctamente
            const savedToken = localStorage.getItem('jwt-auth');
            
            // ✅ CONFIGURAR EN HEADERS INMEDIATAMENTE
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return response.data;
        }
    } catch (error) {
        // Mejorar manejo de errores específicos
        if (error.response && error.response.data) {
            // Personalizar según el tipo de error del backend
            if (error.response.data.details && error.response.data.details.dataInfo) {
                const { dataInfo } = error.response.data.details;
                
                if (dataInfo === 'email') {
                    return { 
                        status: 'Error', 
                        dataInfo: 'email',
                        message: error.response.data.message || 'El correo electrónico no está registrado'
                    };
                } else if (dataInfo === 'rut') {
                    return { 
                        status: 'Error', 
                        dataInfo: 'rut',
                        message: error.response.data.message || 'El RUT ingresado no está registrado'
                    };
                } else if (dataInfo === 'password') {
                    return { 
                        status: 'Error', 
                        dataInfo: 'password',
                        message: error.response.data.message || 'La contraseña es incorrecta'
                    };
                }
            }
            
            return {
                status: 'Error',
                dataInfo: 'auth',
                message: error.response.data.message || 'Error de autenticación'
            };
        } else if (error.request) {
            return { 
                status: "Network Error", 
                dataInfo: 'connection',
                message: "No hay respuesta del servidor. Comprueba tu conexión a internet."
            };
        } else {
            return { 
                status: "Client Error", 
                dataInfo: 'unknown',
                message: error.message || "Error desconocido. Inténtalo de nuevo más tarde."
            };
        }
    }
}

export async function register(data) {
    try {
        // Validaciones preliminares en el cliente
        if (!data.email.match(/@(alumnos\.)?ubiobio\.cl$/)) {
            return { 
                status: 'Error', 
                dataInfo: 'email',
                message: 'Debe usar un correo institucional'
            };
        }
        
        // Formatear RUT si es necesario
        if (data.rut) {
            data.rut = formatRutOnChange(data.rut);
        }
        
        // Validar formato de RUT (solo con puntos)
        const rutRegexConPuntos = /^(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}-[\dkK]$/;
        if (!rutRegexConPuntos.test(data.rut)) {
            return { 
                status: 'Error', 
                dataInfo: 'rut',
                message: 'El RUT debe tener formato xx.xxx.xxx-x'
            };
        }

        if (!data.password || data.password.length < 8) {
            return {
                status: 'Error',
                dataInfo: 'password',
                message: 'La contraseña debe tener al menos 8 caracteres'
            };
        }

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
            // Personalizar errores del backend
            if (error.response.data.details) {
                const errorDetails = error.response.data.details;
                if (typeof errorDetails === 'object' && errorDetails.dataInfo) {
                    return {
                        status: 'Error',
                        dataInfo: errorDetails.dataInfo,
                        message: errorDetails.message || error.response.data.message
                    };
                }
            }
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