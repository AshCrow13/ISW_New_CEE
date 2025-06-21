// Hook para listar actividades
/*
import { useState, useEffect } from 'react';
import { getActivities } from '@services/activity.service.js';

const useActivities = (filters = {}) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        setLoading(true);
        const data = await getActivities(filters);
        setActivities(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchActivities();
    }, [JSON.stringify(filters)]);

    return { activities, loading, fetchActivities, setActivities };
};

export default useActivities;
*/