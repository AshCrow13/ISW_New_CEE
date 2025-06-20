"use strict"
import { Router } from "express";
import {
    postFeedback,
    deleteFeedback,
    getFeedback,
    getFeedbacks,
} from "../controllers/vfeedback.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { hasCarreras } from "../middlewares/carrera.middleware.js";
import { hasRoles } from "../middlewares/rol.middleware.js";

const router = Router();
router.post("/", authenticateJwt, hasCarreras(["Ingeniería en Computación e Informática"]), hasRoles(["administrador", "estudiante"]), postFeedback);
router.get("/", authenticateJwt, hasCarreras(["Ingeniería en Computación e Informática"]), hasRoles(["administrador"]), getFeedbacks);
router.get("/:id", authenticateJwt, hasCarreras(["Ingeniería en Computación e Informática"]), hasRoles(["administrador"]), getFeedback);
router.delete("/:id", authenticateJwt, hasCarreras(["Ingeniería en Computación e Informática"]), hasRoles(["administrador"]), deleteFeedback)

export default router;