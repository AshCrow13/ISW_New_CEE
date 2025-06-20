import { Router } from "express";
import { getHistorial } from "../controllers/historial.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { hasRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", authenticateJwt, hasRoles(["admin"]), getHistorial); // Solo admin puede ver historial

export default router;
