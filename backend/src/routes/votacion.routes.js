"use strict"
import { Router } from "express"
import {
    postVotacion,
    deleteVotacion,
    getVotacion,
    getVotaciones,
    updateVotacion,
} from "../controllers/votacion.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { hasCarreras } from "../middlewares/carrera.middleware.js";
import { hasRoles } from "../middlewares/roles.middleware.js";

const router = Router()

router.post("/", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]),hasRoles(["admin","vocalia"]) , postVotacion);
router.get("/Todas",authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]),hasRoles(["admin","vocalia","estudiante"]),  getVotaciones);
router.get("/:id",authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]),hasRoles(["admin","vocalia","estudiante"]),  getVotacion);
router.patch("/:id", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]),hasRoles(["admin","vocalia"]) , updateVotacion);
router.delete("/:id",authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]),hasRoles(["admin", "vocalia"]) , deleteVotacion); 

export default router;


