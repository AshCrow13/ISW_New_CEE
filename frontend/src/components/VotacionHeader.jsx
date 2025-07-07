// Componente reutilizable para el header de las vistas
import React from 'react';

const HeaderVista = ({ titulo, volverAlMenu }) => {
    return (
        <div className="content-header">
            <h2 className="content-title">{titulo}</h2>
            <button
                onClick={volverAlMenu}
                className="btn-back"
            >
                ⬅ Volver
            </button>
        </div>
    );
};

export default HeaderVista;
