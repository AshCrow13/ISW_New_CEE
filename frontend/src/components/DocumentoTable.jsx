import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Paper
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import ActionButton from '@components/common/ActionButton';

const DocumentoTable = ({
    documentos = [],
    onEdit,
    onDelete,
    onDownload,
    userRole,
}) => {
  // Estado para controlar qué acordeón está expandido
  const [expanded, setExpanded] = useState('Importantes');

  // Agrupar documentos por tipo
  const documentosPorTipo = documentos.reduce((acc, doc) => {
    // Asegurarse de que el tipo exista en el acumulador
    if (!acc[doc.tipo]) {
      acc[doc.tipo] = [];
    }
    // Agregar el documento al array correspondiente
    acc[doc.tipo].push(doc);
    return acc;
  }, {
    // Inicializar las categorías para asegurar que aparecen incluso si están vacías
    'Importantes': [],
    'Actividad': [],
    'Actas': [],
    'Otros': []
  });

  // Función para manejar el cambio de panel expandido
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Función para obtener el nombre de archivo desde la URL
  const getFileName = (url) => {
    if (!url || typeof url !== 'string') return "Sin archivo";
    return url.split('/').pop();
  };

  // Función para determinar el ícono según el tipo de documento
  const getIconForDocType = (tipo) => {
    switch (tipo) {
      case 'Importantes':
        return { color: '#d32f2f' }; // Rojo
      case 'Actividad':
        return { color: '#1976d2' }; // Azul
      case 'Actas':
        return { color: '#388e3c' }; // Verde
      case 'Otros':
        return { color: '#ff9800' }; // Naranja
      default:
        return { icon: '📄', color: '#757575' }; // Gris
    }
  };

  // Función para determinar si un usuario puede editar un documento según su tipo
  const canEditDocument = (userRole, docType) => {
    if (userRole === "admin") return true;
    if (userRole === "vocalia" && (docType === "Actividad" || docType === "Otros")) return true;
    return false;
  };

  // Renderizar un mensaje si no hay documentos
  if (documentos.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: "center", bgcolor: "#f9f9f9", borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay documentos disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Los documentos que se agreguen aparecerán aquí organizados por tipo.
        </Typography>
      </Paper>
    );
  }

  // Renderizar acordeones para cada tipo de documento
  return (
    <Box sx={{ width: "100%", my: 3 }}>
      {Object.entries(documentosPorTipo).map(([tipo, docs]) => {
        const { icon, color } = getIconForDocType(tipo);
        const docsCount = docs.length;

        return (
          <Accordion 
            key={tipo} 
            expanded={expanded === tipo}
            onChange={handleChange(tipo)}
            sx={{ 
              mb: 2,
              boxShadow: expanded === tipo ? 3 : 1,
              '&:before': { display: 'none' },
              borderRadius: '8px',
              overflow: 'hidden',
              border: `1px solid ${expanded === tipo ? color : '#e0e0e0'}`,
              transition: 'all 0.3s ease'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: expanded === tipo ? `${color}15` : '#f9f9f9',
                '&:hover': { bgcolor: `${color}25` }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                  {icon}
                </Typography>
                <Typography variant="h6">
                  {tipo}
                </Typography>
                <Chip 
                  label={`${docsCount} ${docsCount === 1 ? 'documento' : 'documentos'}`} 
                  size="small" 
                  sx={{ ml: 2, bgcolor: docsCount > 0 ? `${color}30` : '#e0e0e0' }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List disablePadding>
                {docs.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No hay documentos en esta categoría" 
                      sx={{ color: "text.secondary", textAlign: "center", py: 2 }} 
                    />
                  </ListItem>
                ) : (
                  docs.map((doc, index) => (
                    <Box key={doc.id || index}>
                      <ListItem sx={{ py: 1.5 }}>
                        <InsertDriveFileIcon sx={{ mr: 2, color }} />
                        <ListItemText 
                          primary={doc.titulo} 
                          secondary={`Subido el ${formatDate(doc.fechaSubida)}`}
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {doc.urlArchivo && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<FileDownloadIcon />}
                                onClick={() => onDownload(doc.id)}
                                sx={{ borderRadius: 2 }}
                              >
                                Descargar
                              </Button>
                            )}
                            {/* Solo mostrar botones de edición y eliminación si el usuario tiene permisos */}
                            {canEditDocument(userRole, doc.tipo) && (
                              <>
                                <ActionButton 
                                  variant="edit"
                                  tooltip="Editar documento"
                                  onClick={() => onEdit(doc)}
                                >
                                  <EditIcon fontSize="small" />
                                </ActionButton>
                                <ActionButton 
                                  variant="delete"
                                  tooltip="Eliminar documento"
                                  onClick={() => onDelete(doc.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </ActionButton>
                              </>
                            )}
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < docs.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                  ))
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default DocumentoTable;


