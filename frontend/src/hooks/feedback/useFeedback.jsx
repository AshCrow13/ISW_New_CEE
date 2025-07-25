import { useState, useEffect } from 'react';
import { getFeedbacks } from '@services/feedback.service.js';

const useFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        setLoading(true);
        const data = await getFeedbacks();
        // Ordenar por fecha de creación (más reciente primero)
        const sortedData = (data || []).sort((a, b) => 
            new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
        );
        setFeedbacks(sortedData);
        setLoading(false);
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return { feedbacks, loading, fetchFeedbacks };
};

export default useFeedbacks;