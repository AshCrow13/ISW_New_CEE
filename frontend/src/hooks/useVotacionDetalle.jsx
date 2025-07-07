import { useState } from 'react';

// Hook para manejar la lógica de presentación de detalles de votación
export function useVotacionDetalle({ votacionSeleccionada, user, handleEliminar }) {
    // Aquí podrías agregar lógica adicional si se requiere en el futuro
    // Por ahora, solo se retorna lo necesario para la UI
    return {
        votacionSeleccionada,
        user,
        handleEliminar
    };
}
