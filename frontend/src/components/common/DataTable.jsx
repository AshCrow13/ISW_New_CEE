import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableSortLabel,
  Box,
  Typography,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Tooltip,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import PropTypes from 'prop-types';

// Styled components
const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50], // Color sólido
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
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

const StatChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Color sólido
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  '& .MuiChip-label': {
    padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  '& .MuiTable-root': {
    '& .MuiTableHead-root': {
      '& .MuiTableCell-root': {
        backgroundColor: theme.palette.primary.main, // Color sólido
        color: theme.palette.primary.contrastText,
        fontWeight: 600,
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: theme.spacing(2),
        borderBottom: 'none',
      },
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
        '& .MuiTableCell-root': {
          padding: theme.spacing(2),
          borderBottom: `1px solid ${theme.palette.grey[100]}`,
          verticalAlign: 'top',
        },
      },
    },
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  color: theme.palette.text.secondary,
}));

const LoadingSkeleton = ({ columns, rows = 5 }) => (
  <>
    {[...Array(rows)].map((_, index) => (
      <TableRow key={index}>
        {columns.map((_, colIndex) => (
          <TableCell key={colIndex}>
            <Skeleton variant="text" width="80%" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

/**
 * Componente DataTable - Tabla reutilizable con funcionalidades comunes
 */
const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange = () => {},
  sortable = true,
  emptyStateText = "No se encontraron resultados",
  emptyStateIcon = "📄",
  stats = [],
  actions = null,
  onRowClick = null,
  stickyHeader = false,
  maxHeight = null,
  ...props
}) => {
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const handleSort = (property) => {
    if (!sortable) return;
    
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = sortable && orderBy 
    ? [...data].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return order === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      })
    : data;

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Header con búsqueda y estadísticas */}
      <SearchContainer>
        <Box display="flex" alignItems="center" gap={2} flex={1}>
          {searchable && (
            <TextField
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              variant="outlined"
              size="small"
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}
          
          {actions && (
            <Box display="flex" gap={1}>
              {actions}
            </Box>
          )}
        </Box>

        {/* Estadísticas */}
        {stats.length > 0 && (
          <StatsContainer>
            {stats.map((stat, index) => (
              <StatChip 
                key={index}
                label={`${stat.value} ${stat.label}`}
                icon={stat.icon}
              />
            ))}
          </StatsContainer>
        )}
      </SearchContainer>

      {/* Tabla */}
      <StyledTableContainer sx={{ maxHeight }}>
        <Table stickyHeader={stickyHeader} {...props}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                      sx={{ 
                        color: 'inherit !important',
                        '& .MuiTableSortLabel-icon': {
                          color: 'inherit !important',
                        },
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <LoadingSkeleton columns={columns} />
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState>
                    <Box sx={{ fontSize: '3rem', mb: 2 }}>{emptyStateIcon}</Box>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {emptyStateText}
                    </Typography>
                    {searchValue && (
                      <Typography variant="body2" color="textSecondary">
                        Intenta con otros términos de búsqueda
                      </Typography>
                    )}
                  </EmptyState>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow 
                  key={row.id || index}
                  hover={!!onRowClick}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render 
                        ? column.render(row[column.id], row, index)
                        : row[column.id]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    minWidth: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    sortable: PropTypes.bool,
    render: PropTypes.func,
  })).isRequired,
  loading: PropTypes.bool,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  sortable: PropTypes.bool,
  emptyStateText: PropTypes.string,
  emptyStateIcon: PropTypes.string,
  stats: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node,
  })),
  actions: PropTypes.node,
  onRowClick: PropTypes.func,
  stickyHeader: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DataTable;
