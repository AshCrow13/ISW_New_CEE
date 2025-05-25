"use strict";
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
/*
import {
  loginEstudiante,
  registerEstudiante,
  logoutEstudiante,
} from "../controllers/auth.controller.js";
*/

const router = Router();

router
  .post("/login", login) // loginEstudiante**
  .post("/register", register) // registerEstudiante**
  .post("/logout", logout); // logoutEstudiante**

export default router;