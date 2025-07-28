"use strict";
import { Router } from "express";
import { 
    generarPDFResultadosVotacion,
    obtenerResultadosVotacion
} from "../controllers/pdf.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/votacion/:id/resultados", authenticateJwt, isAdmin, generarPDFResultadosVotacion);

router.get("/votacion/:id/datos", authenticateJwt, isAdmin, obtenerResultadosVotacion);

export default router;
