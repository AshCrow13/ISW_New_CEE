"use strict";
import { Router } from "express";
/*
import { login, 
  logout, 
  register 
} from "../controllers/auth.controller.js";
*/
import {
  loginEstudiante, 
  logoutEstudiante,
  registerEstudiante,  
} from "../controllers/auth.controller.js";

const router = Router();

router
  .post("/login", loginEstudiante) // loginEstudiante**
  .post("/register", registerEstudiante) // registerEstudiante**
  .post("/logout", logoutEstudiante); // logoutEstudiante**

export default router;