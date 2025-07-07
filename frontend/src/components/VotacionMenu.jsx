// Componente para el menú principal de votaciones
import React from 'react';

const MenuPrincipalVotaciones = ({ 
    user, 
    searchId, 
    setSearchId, 
    setView, 
    handleVerTodas, 
    handleVerUna 
}) => {
    return (
        <div className="menu-grid">
            {/* Solo mostrar el botón de crear si el usuario NO es estudiante */}
            {user && user.rol !== 'estudiante' && (
                <button 
                    onClick={() => setView('crear')}
                    className="menu-button primary"
                >
                    ➕ Crear Nueva Votación
                </button>
            )
            }

            <button 
                onClick={handleVerTodas}
                className="menu-button secondary"
            >
                📋 Ver Todas las Votaciones
            </button>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="ID de votación..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <button 
                    onClick={handleVerUna}
                    className="search-button"
                >
                    🔍 Buscar Votación
                </button>
            </div>

            {user && user.rol !== 'estudiante' && (
                <button 
                    onClick={() => setView('actualizar')}
                    className="menu-button warning"
                >
                    ✏️ Actualizar Votación
                </button>
            )}
        </div>
    );
};

export default MenuPrincipalVotaciones;
