"use strict";
// Configuración para validación de archivos
export const FILE_CONFIG = {
  // Tamaño máximo en bytes (5MB)
  MAX_SIZE: 5 * 1024 * 1024,  
  // Configuraciones por tipo de documento
  DOCUMENT: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain"
    ],
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  
  IMAGE: {
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ],
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    maxSize: 2 * 1024 * 1024 // 2MB
  },
  
  // Función para verificar la extensión del archivo
  isValidExtension: function(filename, type) {
    if (!filename) return false;
    const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
    return this[type].extensions.includes(ext); // Verifica si la extensión es válida
  },
  
  // Función para verificar el tipo MIME
  isValidMimeType: function(mimetype, type) {
    if (!mimetype) return false;
    return this[type].mimeTypes.includes(mimetype); // Verifica si el tipo MIME es válido
  }
};
