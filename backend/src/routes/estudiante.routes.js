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
import { EditarEstudiante } from "../middlewares/EditarEstudiante.middleware.js";

const router = Router();

// Modificar los permisos para que estudiante pueda ver la lista de estudiantes
router
    .get("/", authenticateJwt, hasRoles(["admin", "vocalia", "estudiante"]), getEstudiantes) // Lista todos
    .get("/detail", authenticateJwt, hasRoles(["admin"]), getEstudiante) // Buscar estudiante
    .post("/", authenticateJwt, hasRoles(["admin"]), createEstudiante) // Crea un nuevo estudiante
    .patch("/detail", authenticateJwt, EditarEstudiante, updateEstudiante) // Actualiza un estudiante
    .delete("/detail", authenticateJwt, hasRoles(["admin"]), deleteEstudiante); // Elimina un estudiante

export default router;

