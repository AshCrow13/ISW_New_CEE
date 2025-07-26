// Componente reutilizable para el header de las vistas
import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const VotacionHeader = ({ titulo, volverAlMenu }) => {
    return (
        <div className="content-header">
            <h2 className="content-title">{titulo}</h2>
            <Button
                onClick={volverAlMenu}
                variant="contained"
                startIcon={<ArrowBackIcon />}
                sx={{ borderRadius: 2, fontWeight: 600 }}
            >
                Volver
            </Button>
        </div>
    );
};

export default VotacionHeader;
