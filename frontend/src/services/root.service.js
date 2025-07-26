import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    // las cookies no funcionan en tu entorno
    const token = localStorage.getItem('jwt-auth'); // Obtener el token del localStorage
    
    /*
    console.log(' REQUEST DEBUG:');
    console.log('URL:', config.url);
    console.log('Token encontrado:', token ? 'SÍ' : 'NO');
    console.log('Token source: localStorage');
    console.log('Token (primeros 20 chars):', token ? token.substring(0, 20) + '...' : 'N/A');
    */

    if(token && token !== 'undefined') { // Verificar si el token existe y no es 'undefined'
      config.headers.Authorization = `Bearer ${token}`; // Configurar el header de Authorization
      //console.log(' Authorization header configurado');
    } else {
      //console.log(' NO se configuró Authorization header');
      delete config.headers.Authorization; // Eliminar el header de Authorization si no hay token
    }
    
    //console.log('Headers finales:', config.headers);
    return config;
  },
  (error) => Promise.reject(error) // Manejo de errores en la solicitud
);

instance.interceptors.response.use(
  (response) => { // Aquí puedes manejar la respuesta exitosa
    //console.log(' Response exitosa:', response.config.url);
    return response;
  },
  (error) => { 
    /*
    console.log(' ERROR en response:');
    console.log('URL:', error.config?.url);
    console.log('Status:', error.response?.status);
    console.log('Headers enviados:', error.config?.headers);
    console.log('Error data:', error.response?.data);
    */
    
    if (error.response?.status === 401) { // Token inválido o expirado
      console.warn('Token inválido o expirado, limpiando...');
      localStorage.removeItem('jwt-auth'); // Limpiar token del localStorage
      sessionStorage.removeItem('usuario'); // Limpiar usuario del sessionStorage
      delete instance.defaults.headers.common['Authorization']; // Eliminar header de Authorization
    }
    
    return Promise.reject(error);
  }
);

export default instance;