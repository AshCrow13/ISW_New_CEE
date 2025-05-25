"use strict";
import { loginService, registerService } from "../services/auth.service.js";
import {
  authValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function login(req, res) {
  try {
    const { body } = req;

    const { error } = authValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [accessToken, errorToken] = await loginService(body);

    if (errorToken) return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    handleSuccess(res, 200, "Inicio de sesión exitoso", { token: accessToken });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function register(req, res) {
  try {
    const { body } = req;

    const { error } = registerValidation.validate(body);

    if (error)
      return handleErrorClient(res, 400, "Error de validación", error.message);

    const [newUser, errorNewUser] = await registerService(body);

    if (errorNewUser) return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);

    handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt", { httpOnly: true });
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/*

// VERIFICAR QUE EL CODIGO FUNCIONA CON LOS DEMAS ARCHIVOS******

"use strict";
import { loginEstudianteService, registerEstudianteService } from "../services/auth.service.js";
import { 
  estudianteLoginSchema, 
  estudianteSchema,
} from "../validations/estudiante.validation.js";
import { 
  handleErrorClient, 
  handleErrorServer, 
  handleSuccess, 
} from "../handlers/responseHandlers.js";

// LOGIN
export async function loginEstudiante(req, res) {
  try {
    const { error } = estudianteLoginSchema.validate(req.body);
    if (error)
      return handleErrorClient(res, 400, "Error de validación", error.message);

    const [token, user, errMsg] = await loginEstudianteService(req.body);
    if (errMsg)
      return handleErrorClient(res, 400, "Login fallido", errMsg);

    res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    handleSuccess(res, 200, "Inicio de sesión exitoso", { token, estudiante: user });
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
    res.clearCookie("jwt", { httpOnly: true });
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

*/