"use strict";
import multer from "multer";
import path from "path";
import fs from "fs";
import { FILE_CONFIG } from "../config/fileConfig.js";

// Asegurar que el directorio de uploads exista
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generar nombre único con timestamp y preservar la extensión original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Función de filtro de archivos mejorada
const fileFilter = (req, file, cb) => {
  // Determinar el tipo de archivo que se está subiendo
  let fileType;

  if (req.path.includes("/documentos")) {
    fileType = "DOCUMENT";
  } else if (req.path.includes("/imagenes")) {
    fileType = "IMAGE";
  } else {
    // Por defecto aceptar documentos si no está especificado
    fileType = "DOCUMENT";
  }

  // Verificar tipo MIME
  if (!FILE_CONFIG.isValidMimeType(file.mimetype, fileType)) {
    req.fileValidationError = `Tipo de archivo no permitido. Solo se aceptan: ${FILE_CONFIG[fileType].extensions.join(
      ", "
    )}`;
    return cb(null, false);
  }

  // Verificar extensión
  const ext = path.extname(file.originalname).toLowerCase();
  if (!FILE_CONFIG[fileType].extensions.includes(ext)) {
    req.fileValidationError =
      "Extensión de archivo no permitida. Solo se aceptan: "
      + FILE_CONFIG[fileType].extensions.join(", ");
    return cb(null, false);
  }

  // Si pasa las validaciones, aceptar el archivo
  cb(null, true);
};

// Configuración de límites
const limits = {
  fileSize: FILE_CONFIG.MAX_SIZE,
  files: 1, // Limitar a un solo archivo por carga
};

// Exportar middleware multer con las configuraciones
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
