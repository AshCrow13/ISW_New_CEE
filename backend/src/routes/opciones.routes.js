"user strict"
import { Router } from "express";
import {
    postOpcion,
    deleteOpcion,
    getOpcion,
    getOpciones,
    updateOpcion,
} from "../controllers/opciones.controller.js"
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router()

router.post("/:votacionId/", authenticateJwt, postOpcion);
router.get("/:votacionId/op", authenticateJwt, getOpciones);
router.get("/:votacionId/:id", authenticateJwt, getOpcion);
router.patch("/:votacionId/:id", authenticateJwt, updateOpcion);
router.delete("/:votacionId/:id", authenticateJwt, deleteOpcion);

export default router;