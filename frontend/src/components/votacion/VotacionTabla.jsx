import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import FiltroFecha from '@components/feedbacks/FiltroFecha.jsx';
import ActionButton from '@components/common/ActionButton';
import { filterVotacionesByDate } from '@helpers/votacionHelpers.js';

const VotacionTabla = ({ 
  votaciones, 
  loading, 
  user, 
  onVerDetalle, 
  onEditar, 
  onEliminar, 
  onCrearNueva
}) => {
  // Estado para el filtro de fecha
  const [fechaFiltro, setFechaFiltro] = useState('');

  // Filtrar votaciones por fecha
  const votacionesFiltradas = useMemo(() => 
    filterVotacionesByDate(votaciones, fechaFiltro), 
    [votaciones, fechaFiltro]
  );

  // Handlers para el filtro
  const handleFechaChange = (nuevaFecha) => {
    setFechaFiltro(nuevaFecha);
  };

  const handleClearFilter = () => {
    setFechaFiltro('');
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No definida';
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) return 'Fecha inválida';
      
      return fechaObj.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en fecha';
    }
  };

  const obtenerNombreVotacion = (votacion) => {
    // Manejo seguro del nombre/título
    if (votacion.nombre && typeof votacion.nombre === 'string') {
      return votacion.nombre;
    }
    if (votacion.titulo && typeof votacion.titulo === 'string') {
      return votacion.titulo;
    }
    return 'Sin título';
  };

  const obtenerEstadoVotacion = (votacion) => {
    try {
      const ahora = new Date();
      const inicio = new Date(votacion.inicio);
      const fin = new Date(votacion.fin);
      
      // Verificar que las fechas sean válidas
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return { estado: 'Datos inválidos', color: 'default' };
      }
      
      if (ahora < inicio) {
        return { estado: 'Programada', color: 'info' };
      } else if (ahora >= inicio && ahora <= fin && votacion.estado !== false) {
        return { estado: 'Activa', color: 'success' };
      } else {
        return { estado: 'Cerrada', color: 'error' };
      }
    } catch (error) {
      console.error('Error al determinar estado de votación:', error);
      return { estado: 'Error', color: 'default' };
    }
  };

  const puedeEditarEliminar = user && (user.rol === 'admin' || user.rol === 'vocalia');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando votaciones...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filtro por fecha */}
      <FiltroFecha 
        fechaFiltro={fechaFiltro}
        onFechaChange={handleFechaChange}
        onClearFilter={handleClearFilter}
      />

      {/* Contador de votaciones */}
      {fechaFiltro && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Mostrando {votacionesFiltradas.length} votación{votacionesFiltradas.length !== 1 ? 'es' : ''} 
          para la fecha seleccionada
        </Typography>
      )}

      {/* Tabla */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha Creación</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha Cierre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!Array.isArray(votacionesFiltradas) || votacionesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {fechaFiltro ? 'No hay votaciones para la fecha seleccionada' : 
                     (!Array.isArray(votacionesFiltradas) ? 'Error en los datos de votaciones' : 'No hay votaciones disponibles')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              votacionesFiltradas.map((votacion, index) => {
                const { estado, color } = obtenerEstadoVotacion(votacion);
                return (
                  <TableRow 
                    key={votacion.id || index} 
                    hover
                    sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {obtenerNombreVotacion(votacion)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estado}
                        color={color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatearFecha(votacion.inicio)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatearFecha(votacion.fin)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <ActionButton
                          variant="view"
                          tooltip="Ver detalles"
                          onClick={() => onVerDetalle(votacion.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </ActionButton>
                        
                        {puedeEditarEliminar && (
                          <>
                            <ActionButton
                              variant="edit"
                              tooltip="Editar votación"
                              onClick={() => onEditar(votacion.id)}
                            >
                              <EditIcon fontSize="small" />
                            </ActionButton>
                            
                            <ActionButton
                              variant="delete"
                              tooltip="Eliminar votación"
                              onClick={() => onEliminar(votacion.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </ActionButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VotacionTabla;
