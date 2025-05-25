"user strict"
import { Router } from "express";
import {
    postOpcion,
    deleteOpcion,
    getOpcion,
    getOpciones,
    updateOpcion,
} from "../controllers/opcion.controller.js"

const router = Router()

router.post("/votacion/:votacionId/", postOpcion);
router.get("/votacion/:votacionid/op", getOpciones);
router.get("/votacion/:votacionid/:id", getOpcion);
router.patch("/votacion/:votacionid/:id", updateOpcion);
router.delete("/votacion/:votacionid/:id", deleteOpcion);
