"use strict";
import { Router } from "express";
import {
    createActividad,
    deleteActividad, 
    getActividad,
    getActividades,    
    updateActividad,    
} from "../controllers/actividad.controller.js";

const router = Router();

router
    .get("/", getActividades) // Lista todas o filtra por categoria/fecha
    .get("/detail", getActividad) // Busca una por id, categoria o fecha
    .post("/", createActividad) // Crea una nueva actividad
    .patch("/detail", updateActividad) // Actualiza una actividad existente
    .delete("/detail", deleteActividad); // Elimina una actividad

export default router;

