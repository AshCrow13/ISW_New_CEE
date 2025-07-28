import { Box, Typography, Button, Paper, Breadcrumbs, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Styled components
const HeaderContainer = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px rgba(30, 64, 175, 0.2)`,
  border: 'none',
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  background: 'rgba(255, 255, 255, 0.15)',
  borderRadius: theme.spacing(3),
  fontSize: '0.95rem',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.15)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.25)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-2px)',
  },
}));

/**
 * Componente PageHeader - Header consistente para todas las páginas
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actions = null, 
  stats = [],
  icon = null 
}) => {
  return (
    <HeaderContainer elevation={0}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
        {/* Contenido principal */}
        <Box flex={1} minWidth={0}>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Breadcrumbs 
              separator="›" 
              sx={{ 
                mb: 2,
                '& .MuiBreadcrumbs-separator': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiLink-root': { color: 'rgba(255, 255, 255, 0.8)' },
                '& .MuiTypography-root': { color: 'white' },
              }}
            >
              {breadcrumbs.map((crumb, index) => 
                crumb.href ? (
                  <Link key={index} href={crumb.href} underline="hover">
                    {crumb.label}
                  </Link>
                ) : (
                  <Typography key={index} variant="body2">
                    {crumb.label}
                  </Typography>
                )
              )}
            </Breadcrumbs>
          )}
          
          {/* Título y subtítulo */}
          <Box display="flex" alignItems="center" gap={2} mb={subtitle ? 1 : 0}>
            {icon && <Box sx={{ fontSize: '2.5rem' }}>{icon}</Box>}
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
          </Box>
          
          {subtitle && (
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.95,
                fontSize: '1.1rem',
                fontWeight: 400,
                color: 'white',
                mb: stats.length > 0 ? 2 : 0,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <StatsContainer>
              {stats.map((stat, index) => (
                <StatItem key={index}>
                  {stat.icon && <Box>{stat.icon}</Box>}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'white' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </StatItem>
              ))}
            </StatsContainer>
          )}
        </Box>

        {/* Acciones */}
        {actions && (
          <Box display="flex" gap={1} flexWrap="wrap">
            {Array.isArray(actions) ? (
              actions.map((action, index) => (
                <ActionButton key={index} {...action.props}>
                  {action.icon && <Box mr={1}>{action.icon}</Box>}
                  {action.label}
                </ActionButton>
              ))
            ) : (
              actions
            )}
          </Box>
        )}
      </Box>
    </HeaderContainer>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
  })),
  actions: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      props: PropTypes.object,
    })),
  ]),
  stats: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node,
  })),
  icon: PropTypes.node,
};

export default PageHeader;
