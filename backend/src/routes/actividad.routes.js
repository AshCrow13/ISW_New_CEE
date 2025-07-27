"use strict";
import { Router } from "express";
import {
    createActividad,
    deleteActividad, 
    getActividad,
    getActividades,    
    updateActividad,    
} from "../controllers/actividad.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { hasRoles } from "../middlewares/roles.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadErrorHandler } from "../middlewares/uploadError.middleware.js";

const router = Router();

router
    .get("/", authenticateJwt, getActividades) // Lista todas o filtra por categoria/fecha
    .get("/detail", authenticateJwt, getActividad); // Busca una por id, categoria o fecha

router
    .post("/", authenticateJwt,  hasRoles(["admin", "vocalia"]), upload.single("archivo"),
        uploadErrorHandler, createActividad ) // Crea una nueva actividad
    .patch("/detail", authenticateJwt, hasRoles(["admin", "vocalia"]), updateActividad) // Actualiza una actividad
    .delete("/detail", authenticateJwt, hasRoles(["admin", "vocalia"]), deleteActividad); // Elimina una actividad

export default router;

