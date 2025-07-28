import { useState, useEffect, useMemo } from 'react';
import { getHistorial } from '@services/historial.service.js';
import { useAuth } from '@context/AuthContext';
import { 
    History as HistoryIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Box, Typography, Chip } from '@mui/material';
import PageContainer from '@components/common/PageContainer';
import PageHeader from '@components/common/PageHeader';
import DataTable from '@components/common/DataTable';

const Historial = () => { // Componente para mostrar el historial de acciones
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const { user } = useAuth(); // Obtener información del usuario autenticado**

    useEffect(() => { // Cargar historial al montar el componente
        fetchHistorial();
    }, []);

    const fetchHistorial = async () => {
        setLoading(true);
        try {
            const data = await getHistorial(); // Llamada al servicio para obtener el historial
            console.log('Datos de historial recibidos:', data); // Debug
            if (data && data.length > 0) {
                console.log('Primer elemento del historial:', data[0]); // Debug
            }
            setHistorial(Array.isArray(data) ? data : []);
        } catch (error) { // Manejo de errores al cargar el historial
            console.error('Error al cargar historial:', error);
            setHistorial([]);
        }
        setLoading(false);
    };

    // Configurar columnas para DataTable
    const columns = [
        { 
            id: 'fecha', 
            label: 'Fecha y Hora', 
            minWidth: 180,
            render: (value, row) => {
                if (!value) return (
                    <Typography variant="body2" color="text.secondary">
                        Sin fecha
                    </Typography>
                );
                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.primary" fontWeight={500}>
                            {new Date(value).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Typography>
                    </Box>
                );
            }
        },
        { 
            id: 'usuario', 
            label: 'Usuario', 
            minWidth: 200,
            render: (value, row) => {
                const usuarioInfo = value;
                let displayName = 'Usuario desconocido';
                let email = '';

                if (typeof usuarioInfo === 'string') {
                    displayName = usuarioInfo;
                } else if (usuarioInfo && typeof usuarioInfo === 'object') {
                    displayName = usuarioInfo.nombreCompleto || usuarioInfo.nombre || usuarioInfo.email || 'Usuario desconocido';
                    email = usuarioInfo.email || '';
                }

                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon fontSize="small" color="action" />
                        <Box>
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                {displayName}
                            </Typography>
                            {email && (
                                <Typography variant="caption" color="text.secondary">
                                    {email}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                );
            }
        },
        { 
            id: 'accion', 
            label: 'Acción',
            minWidth: 120,
            render: (value) => (
                <Chip 
                    label={value || 'Sin acción'} 
                    size="small"
                    variant="outlined"
                    color="primary"
                />
            )
        },
        { 
            id: 'tipo', 
            label: 'Tipo',
            minWidth: 100,
            render: (value) => (
                <Chip 
                    label={value || 'Sin tipo'} 
                    size="small"
                    variant="filled"
                    color="secondary"
                />
            )
        },
        { 
            id: 'detalle', 
            label: 'Detalle',
            minWidth: 200,
            render: (value) => (
                <Typography variant="body2" color="text.secondary">
                    {value || 'Sin detalles'}
                </Typography>
            )
        }
    ];

    // Filtrado más seguro
    const filteredRows = useMemo(() => {
        if (!filter) return historial;
        return historial.filter(row => {
            if (!row || typeof row !== 'object') return false;
            
            // Extraer información del usuario de manera más robusta
            let usuarioString = '';
            if (typeof row.usuario === 'string') {
                usuarioString = row.usuario;
            } else if (row.usuario && typeof row.usuario === 'object') {
                usuarioString = row.usuario.nombreCompleto || row.usuario.nombre || row.usuario.email || '';
            }
            
            const accion = row.accion || '';
            const tipo = row.tipo || '';
            const detalle = row.detalle || '';

            const searchText = filter.toLowerCase();
            return usuarioString.toLowerCase().includes(searchText) || 
                   accion.toLowerCase().includes(searchText) ||
                   tipo.toLowerCase().includes(searchText) ||
                   detalle.toLowerCase().includes(searchText);
        });
    }, [historial, filter]);

    const getStatsData = () => {
        // Extraer usuarios únicos de manera más robusta
        const usuarios = historial.map(h => {
            if (typeof h.usuario === 'string') {
                return h.usuario;
            } else if (h.usuario && typeof h.usuario === 'object') {
                return h.usuario.nombreCompleto || h.usuario.nombre || h.usuario.email;
            }
            return null;
        }).filter(Boolean);

        return [
            {
                label: 'acciones registradas',
                value: filteredRows.length,
                icon: <HistoryIcon />,
            },
            {
                label: 'usuarios activos',
                value: new Set(usuarios).size,
            },
            {
                label: 'tipos de acción',
                value: new Set(historial.map(h => h.accion).filter(Boolean)).size,
            },
        ];
    };

    return (
        <PageContainer>
            <PageHeader
                title="Historial de Acciones"
                subtitle="Registro completo de todas las acciones realizadas en el sistema"
                icon={<HistoryIcon />}
                breadcrumbs={[
                    { label: 'Inicio', href: '/home' },
                    { label: 'Historial' }
                ]}
                stats={getStatsData()}
            />

            <DataTable
                data={filteredRows}
                columns={columns}
                loading={loading}
                emptyMessage="No hay acciones registradas"
                searchable={true}
                searchValue={filter}
                onSearchChange={setFilter}
                searchPlaceholder="Buscar por usuario, acción, tipo o detalle..."
                sortable={true}
                stats={[
                    {
                        label: 'registros',
                        value: filteredRows.length,
                    },
                ]}
            />
        </PageContainer>
    );
};

export default Historial;
