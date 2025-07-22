"use strict"
import { Router } from "express";
import {
    postFeedback,
    deleteFeedback,
    getFeedback,
    getFeedbacks,
} from "../controllers/vfeedback.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { hasCarreras } from "../middlewares/carrera.middleware.js";
import { hasRoles } from "../middlewares/roles.middleware.js";

const router = Router();
router.post("/", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]), hasRoles(["admin","vocalia", "estudiante"]), postFeedback);
router.get("/", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]), hasRoles(["admin","vocalia"]), getFeedbacks);
router.get("/:id", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]), hasRoles(["admin", "vocalia"]), getFeedback);
router.delete("/:id", authenticateJwt, hasCarreras(["Ingeniería Civil Informática"]), hasRoles(["admin","vocalia"]), deleteFeedback)

export default router