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
import { hasCarreras } from "../middlewares/carrera.middleware.js";
import { hasRoles } from "../middlewares/roles.middleware.js";

const router = Router()

router.post("/:votacionId", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]), hasRoles(["admin","vocalia"]), postOpcion);
router.get("/:votacionId", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]), hasRoles(["admin","vocalia","estudiante"]), getOpciones);
router.get("/:votacionId/:id", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]), hasRoles(["admin","vocalia","estudiante"]), getOpcion);
router.patch("/:votacionId/:id", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]),hasRoles(["admin","vocalia"]) , updateOpcion);
router.delete("/:votacionId/:id", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]),hasRoles(["admin","vocalia"]) , deleteOpcion);

export default router;