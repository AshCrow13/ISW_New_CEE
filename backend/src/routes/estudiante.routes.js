import { Router } from "express";
import {
    createEstudiante,
    deleteEstudiante,
    getEstudiante,
    getEstudiantes,       
    updateEstudiante    
} from "../controllers/estudiante.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { hasRoles } from "../middlewares/roles.middleware.js";

const router = Router();

// Solo admin puede ver, editar o borrar estudiantes
router
    .get("/", authenticateJwt, hasRoles(["admin"]), getEstudiantes) // Lista todos los estudiantes
    .get("/detail", authenticateJwt, hasRoles(["admin"]), getEstudiante) // Buscar estudiante
    .post("/", authenticateJwt, hasRoles(["admin"]), createEstudiante) // Crea un nuevo estudiante
    .patch("/detail", authenticateJwt, hasRoles(["admin"]), updateEstudiante) // Actualiza un estudiante
    .delete("/detail", authenticateJwt, hasRoles(["admin"]), deleteEstudiante); // Elimina un estudiante

export default router;

