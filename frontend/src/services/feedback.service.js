import axios from './root.service.js';

export async function getFeedbacks() {
    try {
        const response = await axios.get('/feedback');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener feedbacks:', error);
        return [];
    }
}

export async function postFeedback(data) {
    try {
        const response = await axios.post('/feedback', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
} 