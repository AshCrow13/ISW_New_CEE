import { useState, useEffect } from 'react';
import { getHistorial } from '@services/historial.service.js';
import HistorialTable from '@components/HistorialTable';
import { useAuth } from '@context/AuthContext';

const Historial = () => { // Página de historial
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => { // Cargar historial al montar el componente
        fetchHistorial();
        // eslint-disable-next-line
    }, []);

    const fetchHistorial = async () => { // Función para obtener el historial
        setLoading(true);
        const data = await getHistorial();
        setHistorial(data);
        setLoading(false);
    };

    return ( // Renderizado del componente
        <div className="container">
        <h1>Historial de acciones</h1>
        {loading ? (
            <p>Cargando historial...</p>
        ) : (
            <HistorialTable historial={historial} />
        )}
        </div>
    );
};

export default Historial;
