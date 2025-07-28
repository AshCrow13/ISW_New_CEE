import { IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

// Componente de botón de acción estilizado para tablas
const StyledActionButton = styled(IconButton)(({ theme, variant }) => {
    const baseStyles = {
        width: 40,
        height: 40,
        borderRadius: theme.spacing(1.5),
        transition: 'all 0.2s ease',
        border: '1px solid',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
    };

    const variants = {
        view: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.main,
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                borderColor: theme.palette.primary.dark,
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
            },
        },
        edit: {
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
            borderColor: theme.palette.warning.main,
            '&:hover': {
                backgroundColor: theme.palette.warning.dark,
                borderColor: theme.palette.warning.dark,
                boxShadow: `0 4px 12px ${theme.palette.warning.main}40`,
            },
        },
        delete: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            borderColor: theme.palette.error.main,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
                borderColor: theme.palette.error.dark,
                boxShadow: `0 4px 12px ${theme.palette.error.main}40`,
            },
        },
        success: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            borderColor: theme.palette.success.main,
            '&:hover': {
                backgroundColor: theme.palette.success.dark,
                borderColor: theme.palette.success.dark,
                boxShadow: `0 4px 12px ${theme.palette.success.main}40`,
            },
        },
        info: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            borderColor: theme.palette.info.main,
            '&:hover': {
                backgroundColor: theme.palette.info.dark,
                borderColor: theme.palette.info.dark,
                boxShadow: `0 4px 12px ${theme.palette.info.main}40`,
            },
        },
        // Variantes específicas para diferentes acciones
        asistencia: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            borderColor: theme.palette.success.main,
            '&:hover': {
                backgroundColor: theme.palette.success.dark,
                borderColor: theme.palette.success.dark,
                boxShadow: `0 4px 12px ${theme.palette.success.main}40`,
            },
        },
        download: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            borderColor: theme.palette.info.main,
            '&:hover': {
                backgroundColor: theme.palette.info.dark,
                borderColor: theme.palette.info.dark,
                boxShadow: `0 4px 12px ${theme.palette.info.main}40`,
            },
        },
        list: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            borderColor: theme.palette.info.main,
            '&:hover': {
                backgroundColor: theme.palette.info.dark,
                borderColor: theme.palette.info.dark,
                boxShadow: `0 4px 12px ${theme.palette.info.main}40`,
            },
        },
    };

    return {
        ...baseStyles,
        ...(variants[variant] || variants.view),
    };
});

/**
 * Componente ActionButton - Botón de acción estándar para tablas
 * @param {string} variant - Variante del botón (view, edit, delete, success, info, asistencia, download, list)
 * @param {string} tooltip - Texto del tooltip
 * @param {function} onClick - Función a ejecutar al hacer clic
 * @param {React.ReactNode} children - Icono o contenido del botón
 * @param {object} props - Props adicionales
 */
const ActionButton = ({ 
    variant = 'view', 
    tooltip, 
    onClick, 
    children, 
    disabled = false,
    ...props 
}) => {
    const button = (
        <StyledActionButton
            variant={variant}
            onClick={onClick}
            disabled={disabled}
            size="small"
            {...props}
        >
            {children}
        </StyledActionButton>
    );

    // Si hay tooltip, envolver en Tooltip
    if (tooltip) {
        return (
            <Tooltip title={tooltip}>
                <span>
                    {button}
                </span>
            </Tooltip>
        );
    }

    return button;
};

export default ActionButton;
