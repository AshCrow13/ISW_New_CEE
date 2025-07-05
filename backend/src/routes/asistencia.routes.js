"use strict";
import { Router } from "express";
import {
  createAsistencia,
  getAsistencias,
  getAsistencia,
  updateAsistencia,
  deleteAsistencia
} from "../controllers/asistencia.controller.js";

const router = Router();

router
  .get("/", getAsistencias)
  .get("/detail", getAsistencia)
  .post("/", createAsistencia)
  .patch("/detail", updateAsistencia)
  .delete("/detail", deleteAsistencia);

export default router;