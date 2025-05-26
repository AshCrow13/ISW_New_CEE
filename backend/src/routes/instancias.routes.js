"use strict";
import { Router } from "express";
import {
    createInstancia, 
    deleteInstancia, 
    getInstancia,
    getInstancias,    
    updateInstancia,    
} from "../controllers/instancias.controller.js";

const router = Router();

router
    .get("/", getInstancias)
    .get("/detail", getInstancia)
    .post("/", createInstancia)
    .patch("/detail", updateInstancia)
    .delete("/detail", deleteInstancia);

export default router;