"use strict";
import { Router } from "express";
import {
  createAsistencia,
  getAsistencias,
  getAsistencia,
  updateAsistencia,
  deleteAsistencia
} from "../controllers/asistencia.controller.js";
import { validateCreateAsistencia, validateGetAsistencia } from "../validations/asistencia.validation.js";

const router = Router();

router
  .get("/", getAsistencias)
  .get("/detail", validateGetAsistencia, getAsistencia)
  .post("/", validateCreateAsistencia, createAsistencia)
  .patch("/detail", updateAsistencia)
  .delete("/detail", deleteAsistencia);

export default router;