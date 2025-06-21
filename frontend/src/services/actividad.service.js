// Lógica para consumir endpoints actividades
/*
import axios from './root.service.js';

export async function getActivities(params) {
    try {
        // params puede ser { categoria, fechaInicio, fechaFin, q }
        const { data } = await axios.get('/actividades', { params }); 
        return data.data;
    } catch (error) {
        return [];
    }
}

export async function createActivity(activityData) {
    try {
        const { data } = await axios.post('/actividades', activityData);
        return data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateActivity(id, activityData) {
    try {
        const { data } = await axios.patch(`/actividades/detail?id=${id}`, activityData);
        return data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteActivity(id) {
    try {
        const { data } = await axios.delete(`/actividades/detail?id=${id}`);
        return data;
    } catch (error) {
        return error.response.data;
    }
}
*/