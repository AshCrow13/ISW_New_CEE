// Componente para la vista de actualización (en desarrollo)
import React from 'react';

const VistaActualizacion = ({ user }) => {
    if (!user || user.rol !== 'admin') {
        return null;
    }

    return (
        <div className="development-notice">
            <p>🚧 Funcionalidad de actualización en desarrollo</p>
            <p>Por ahora puedes eliminar y crear nuevas votaciones</p>
        </div>
    );
};

export default VistaActualizacion;
