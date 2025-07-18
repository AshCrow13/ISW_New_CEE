"use strict";
import {
  loginService as loginEstudianteService,
  registerService as registerEstudianteService,
} from "../services/auth.service.js";
import { estudianteLoginSchema, estudianteSchema } from "../validations/estudiante.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// LOGIN
export async function loginEstudiante(req, res) {
  try {
    
    const { error } = estudianteLoginSchema.validate(req.body);
    if (error)
      return handleErrorClient(res, 400, "Error de validación", error.message);

    const [token, errMsg] = await loginEstudianteService(req.body);
    if (errMsg)
      return handleErrorClient(res, 400, "Login fallido", errMsg);

    res.cookie("jwt-auth", token, {
      httpOnly: true, // true en producción para mayor seguridad
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax", // o "strict"
      secure: process.env.NODE_ENV === "production" // true si usas https
    });
    handleSuccess(res, 200, "Inicio de sesión exitoso", { token });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// REGISTRO
export async function registerEstudiante(req, res) {
  try {
    const { error } = estudianteSchema.validate(req.body);
    if (error)
      return handleErrorClient(res, 400, "Error de validación", error.message);

    const [newEstudiante, errMsg] = await registerEstudianteService(req.body);
    if (errMsg)
      return handleErrorClient(res, 400, "Error al registrar", errMsg);

    handleSuccess(res, 201, "Estudiante registrado exitosamente", newEstudiante);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// LOGOUT
export async function logoutEstudiante(req, res) {
  try {
    res.clearCookie("jwt-auth", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
