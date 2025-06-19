"use strict";
import { Router } from "express";
import {
  createDocumento, 
  deleteDocumento, 
  getDocumento,
  getDocumentos,    
  updateDocumento,    
} from "../controllers/documento.controller.js";

const router = Router();

router
  .get("/", getDocumentos) // Lista todos o filtra por tipo, id_actividad o fecha
  .get("/detail", getDocumento) // Busca uno por id, tipo, id_actividad o fecha
  .post("/", createDocumento) // Crea un nuevo documento
  .patch("/detail", updateDocumento) // Actualiza un documento existente
  .delete("/detail", deleteDocumento); // Elimina un documento

export default router;

