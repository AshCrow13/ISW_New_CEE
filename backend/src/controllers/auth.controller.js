// VERIFICAR QUE EL CODIGO FUNCIONA CON LOS DEMAS ARCHIVOS******

"use strict";
import { loginEstudianteService, 
  registerEstudianteService 
} from "../services/auth.service.js";
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
