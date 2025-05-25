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

router.post("/votacion/", postVotacion);
router.get("/votacion/:id", getVotaciones);
router.get("/votacion/Todas", getVotacion);
router.patch("/votacion/:id", updateVotacion);
router.delete("/votacion/:id", deleteVotacion);



