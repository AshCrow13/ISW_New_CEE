"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createActividad,
    getActividades,
    getActividadById,
    updateActividad,
    deleteActividad,
} from "../controllers/actividad.controller.js";

const router = Router();

router.use(authenticateJwt);

router
    .get("/", getActividades)
    .get("/:id", getActividadById)
    .post("/", createActividad)
    .patch("/:id", updateActividad)
    .delete("/:id", deleteActividad);

export default router;
