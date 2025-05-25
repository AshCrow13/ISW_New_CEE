"use strict"
import { Router } from "express"
import {
    postVotacion,
    deleteVotacion,
    getVotacion,
    getVotaciones,
    updateVotacion,
} from "../controllers/votacion.controller.js"

const router = Router()

router.post("/Votacion/Crear", postVotacion);
router.get("/Votacion/Ver/", getVotaciones);
router.get("/Votacion/Todas", getVotacion);
router.patch("/Votacion/Modificar", updateVotacion);
router.delete("/Votacion/Borrar", deleteVotacion);



