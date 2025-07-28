import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Styled StatusChip component
const StyledChip = styled(Chip)(({ theme, variant }) => {
  const variants = {
    // Estados de asamblea
    completed: {
      backgroundColor: theme.palette.success.main, // Color sólido
      color: theme.palette.success.contrastText,
      border: `1px solid ${theme.palette.success.main}`,
    },
    upcoming: {
      backgroundColor: theme.palette.warning.main, // Color sólido
      color: theme.palette.warning.contrastText,
      border: `1px solid ${theme.palette.warning.main}`,
    },
    scheduled: {
      backgroundColor: theme.palette.info.main, // Color sólido
      color: theme.palette.info.contrastText,
      border: `1px solid ${theme.palette.info.main}`,
    },
    // Estados de asistencia
    open: {
      backgroundColor: theme.palette.success.main, // Color sólido
      color: theme.palette.success.contrastText,
      border: `1px solid ${theme.palette.success.main}`,
    },
    closed: {
      backgroundColor: theme.palette.error.main, // Color sólido
      color: theme.palette.error.contrastText,
      border: `1px solid ${theme.palette.error.main}`,
    },
    // Estados generales
    active: {
      backgroundColor: theme.palette.success.main, // Color sólido
      color: theme.palette.success.contrastText,
      border: `1px solid ${theme.palette.success.main}`,
    },
    inactive: {
      backgroundColor: theme.palette.grey[500], // Color sólido
      color: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey[500]}`,
    },
    pending: {
      backgroundColor: theme.palette.warning.main, // Color sólido
      color: theme.palette.warning.contrastText,
      border: `1px solid ${theme.palette.warning.main}`,
    },
    // Estados de prioridad
    high: {
      backgroundColor: theme.palette.error.main, // Color sólido
      color: theme.palette.error.contrastText,
      border: `1px solid ${theme.palette.error.main}`,
    },
    medium: {
      backgroundColor: theme.palette.warning.main, // Color sólido
      color: theme.palette.warning.contrastText,
      border: `1px solid ${theme.palette.warning.main}`,
    },
    low: {
      backgroundColor: theme.palette.info.main, // Color sólido
      color: theme.palette.info.contrastText,
      border: `1px solid ${theme.palette.info.main}`,
    },
    // Estados de usuario
    admin: {
      backgroundColor: theme.palette.primary.main, // Color sólido
      color: theme.palette.primary.contrastText,
      border: `1px solid ${theme.palette.primary.main}`,
    },
    vocalia: {
      backgroundColor: theme.palette.secondary.main, // Color sólido
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
    },
    estudiante: {
      backgroundColor: theme.palette.grey[200], // Color sólido
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.grey[300]}`,
    },
  };

  return {
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderRadius: theme.spacing(3),
    ...(variants[variant] || variants.inactive),
  };
});

/**
 * Componente StatusChip - Chip reutilizable para mostrar estados
 */
const StatusChip = ({ 
  variant = 'inactive', 
  label, 
  icon, 
  size = 'small',
  ...props 
}) => {
  return (
    <StyledChip
      variant={variant}
      label={label}
      icon={icon}
      size={size}
      {...props}
    />
  );
};

StatusChip.propTypes = {
  variant: PropTypes.oneOf([
    'completed', 'upcoming', 'scheduled',
    'open', 'closed',
    'active', 'inactive', 'pending',
    'high', 'medium', 'low',
    'admin', 'vocalia', 'estudiante'
  ]),
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium']),
};

export default StatusChip;
