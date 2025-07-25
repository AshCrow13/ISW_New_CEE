import { Box, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const DateFilter = ({ fechaFiltro, onFechaChange, onClearFilter }) => {
  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <FilterListIcon color="primary" />
      <TextField
        type="date"
        label="Filtrar por fecha"
        value={fechaFiltro}
        onChange={(e) => onFechaChange(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
        sx={{ minWidth: 200 }}
      />
      {fechaFiltro && (
        <Button 
          size="small" 
          variant="outlined" 
          onClick={onClearFilter}
        >
          Limpiar filtro
        </Button>
      )}
    </Box>
  );
};

export default DateFilter;
