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

router.post("/", postVotacion);
router.get("/:id", getVotaciones);
router.get("/Todas", getVotacion);
router.patch("/:id", updateVotacion);
router.delete("/:id", deleteVotacion); 

export default router;


