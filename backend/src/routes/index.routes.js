"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import estudianteRoutes from "./estudiante.routes.js";
import actividadRoutes from "./actividad.routes.js";
import documentoRoutes from "./documento.routes.js";

import opcionesRoutes from "./opciones.routes.js";
import votacionRoutes from "./votacion.routes.js";
import votosRoutes from "./votos.routes.js";

import instanciaRoutes from "./instancias.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/estudiantes", estudianteRoutes);
router.use("/actividades", actividadRoutes);
router.use("/documentos", documentoRoutes);

router.use("/votacion", votacionRoutes);
router.use("/opcion", opcionesRoutes);
router.use("/votar", votosRoutes);

router.use("/asamblea", instanciaRoutes);

export default router;
