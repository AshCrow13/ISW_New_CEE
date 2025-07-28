import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 9vh)',
  backgroundColor: theme.palette.grey[50], // Color sólido en lugar de degradado
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(4),
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1400px',
  },
}));

/**
 * Componente PageContainer - Contenedor consistente para todas las páginas
 */
const PageContainer = ({ 
  children, 
  maxWidth = 'lg',
  disableGutters = false,
  sx = {}
}) => {
  return (
    <PageWrapper sx={sx}>
      <ContentContainer 
        maxWidth={maxWidth} 
        disableGutters={disableGutters}
      >
        {children}
      </ContentContainer>
    </PageWrapper>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  disableGutters: PropTypes.bool,
  sx: PropTypes.object,
};

export default PageContainer;
