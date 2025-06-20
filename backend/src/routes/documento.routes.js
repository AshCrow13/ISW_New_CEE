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
import upload from "../middlewares/upload.middleware.js";
import { uploadErrorHandler } from "../middlewares/uploadError.middleware.js";

const router = Router();

router
    .get("/", authenticateJwt, getDocumentos) // Listar todos los documentos o filtrar por tipo, fecha, etc.
    .get("/detail", authenticateJwt, getDocumento) // Buscar un documento por id, tipo, fecha, etc.
    .get("/download/:id", authenticateJwt, downloadDocumento); // Descargar un documento
router
    .post(
      "/", authenticateJwt, hasRoles(["admin", "vocalia"]), upload.single("archivo"), uploadErrorHandler,createDocumento
    ) // Crear un nuevo documento 
    .patch("/detail", authenticateJwt, hasRoles(["admin", "vocalia"]), updateDocumento) // Actualizar un documento
    .delete("/detail", authenticateJwt, hasRoles(["admin", "vocalia"]), deleteDocumento); // Eliminar un documento

export default router;
