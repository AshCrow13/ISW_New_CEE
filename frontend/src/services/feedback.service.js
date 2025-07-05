import axios from './root.service.js';

export async function getFeedbacks(data) {
    try{
        const {data} = await axios.post('/feedbacks/getFeedbacks', data);
        return data.data;
    } catch (error) {
        return [];
    }
}

export async function postFeedback(data) {
    try {
        const response = await axios.post('/feedbacks/postFeedback', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
} 