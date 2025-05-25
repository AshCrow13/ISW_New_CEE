"use strict";
import { Router } from "express";
import {
    createEstudiante,
    deleteEstudiante,
    getEstudiante,
    getEstudiantes,       
    updateEstudiante    
} from "../controllers/estudiante.controller.js";

const router = Router();

router
    .get("/", getEstudiantes) // Listar todos
    .get("/detail", getEstudiante) // Buscar por id, rut o email
    .post("/", createEstudiante) // Crear
    .patch("/detail", updateEstudiante) // Actualizar
    .delete("/detail", deleteEstudiante); // Eliminar

export default router;
