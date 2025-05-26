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

const router = Router()

router.post("/", authenticateJwt, postVotacion);
router.get("/Todas",authenticateJwt, getVotaciones);
router.get("/:id",authenticateJwt, getVotacion);
router.patch("/:id", authenticateJwt, updateVotacion);
router.delete("/:id",authenticateJwt, deleteVotacion); 

export default router;


