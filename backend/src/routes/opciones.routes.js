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
router.get("/:votacionid/op", authenticateJwt, getOpciones);
router.get("/:votacionid/:id", authenticateJwt, getOpcion);
router.patch("/:votacionid/:id", authenticateJwt, updateOpcion);
router.delete("/:votacionid/:id", authenticateJwt, deleteOpcion);

export default router;