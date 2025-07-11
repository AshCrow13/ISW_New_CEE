"use strict";
import { Router } from "express";
import {
  createDocumento, 
  deleteDocumento, 
  downloadDocumento,
  getDocumento,
  getDocumentos,    
  updateDocumento
} from "../controllers/documento.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { hasRoles } from "../middlewares/roles.middleware.js";
import { canCreateDocumentType, canModifyDocument } from "../middlewares/documentPermissions.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadErrorHandler, validateMimeType } from "../middlewares/uploadError.middleware.js";
import { FILE_CONFIG } from "../config/fileConfig.js";

const router = Router();

// Rutas públicas (requieren autenticación)
router
    .get("/", authenticateJwt, getDocumentos) // Cualquier usuario autenticado puede ver documentos
    .get("/detail", authenticateJwt, getDocumento) // Cualquier usuario autenticado puede ver detalles
    .get("/download/:id", authenticateJwt, downloadDocumento); // Cualquier usuario autenticado puede descargar

// Rutas protegidas (requieren autenticación y permisos)
router
    .post(
      "/", 
      authenticateJwt, 
      hasRoles(["admin", "vocalia"]),
      canCreateDocumentType, // Verificar si puede crear este tipo de documento
      upload.single("archivo"), 
      uploadErrorHandler,
      validateMimeType(FILE_CONFIG.DOCUMENT.mimeTypes),
      createDocumento
    )
    .patch(
      "/detail", 
      authenticateJwt, 
      hasRoles(["admin", "vocalia"]),
      canModifyDocument, // Verificar si puede modificar este documento
      updateDocumento
    )
    .delete(
      "/detail", 
      authenticateJwt, 
      hasRoles(["admin", "vocalia"]),
      canModifyDocument, // Verificar si puede eliminar este documento
      deleteDocumento
    );

export default router;
