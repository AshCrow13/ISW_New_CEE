"use strict";
import { handleErrorClient } from "../handlers/responseHandlers.js";
import { FILE_CONFIG } from "../config/fileConfig.js";

/**
 * Middleware para manejar errores durante la carga de archivos
 */
export function uploadErrorHandler(req, res, next) {
  // Si hubo un error de validación de archivo, responder con el error
  if (req.fileValidationError) {
    return handleErrorClient(res, 400, req.fileValidationError);
  }

  // Permitir que el archivo sea opcional en rutas de actividades
  if (!req.file) {
    // Si la ruta es /documentos, el archivo es obligatorio
    if (req.path.includes("/documentos")) {
      return handleErrorClient(res, 400, "No se ha subido ningún archivo o el archivo no es válido");
    }
    // En otras rutas (como /actividades), permitir continuar sin archivo
    return next();
  }

  // Si el archivo excede el tamaño máximo (este error lo maneja multer directamente)
  // pero por si acaso hacemos una verificación adicional
  const fileSize = req.file.size;
  let maxSize = FILE_CONFIG.MAX_SIZE;
  let fileType;
  
  if (req.path.includes("/documentos")) { // Verificar si es una ruta de documentos
    fileType = "DOCUMENT";
    maxSize = FILE_CONFIG.DOCUMENT.maxSize;
  } else if (req.path.includes("/imagenes")) { // Verificar si es una ruta de imágenes
    fileType = "IMAGE";
    maxSize = FILE_CONFIG.IMAGE.maxSize;
  }
  
  if (fileSize > maxSize) { // Si el archivo excede el tamaño máximo permitido
    return handleErrorClient(
      res, 
      400, 
      `El archivo excede el tamaño máximo permitido de ${maxSize / (1024 * 1024)}MB`
    );
  }

  // Si todo está bien, continuar
  next();
}

/**
 * Middleware para validar tipos MIME específicos
 * @param {Array} allowedTypes - Array de tipos MIME permitidos
 */
export function validateMimeType(allowedTypes) {
  return (req, res, next) => {
    if (!req.file) {
      return next(); // Si no hay archivo, pasar al siguiente middleware
    }
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      return handleErrorClient(
        res, 
        400, 
        "Tipo de archivo no permitido. Solo se aceptan: " + allowedTypes.join(", ")
      );
    }
    
    next();
  };
}
