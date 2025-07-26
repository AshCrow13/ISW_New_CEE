import { handleErrorClient } from "../handlers/responseHandlers.js";

export function EditarEstudiante(req, res, next) {
    const user = req.user;
    const rutQuery = req.query.rut;
    if (!user) {
        return handleErrorClient(res, 401, "No autenticado");
    }
    if (user.rol === "admin") {
        return next(); // Admin puede editar cualquier usuario
    }
    if ((user.rol === "vocalia" || user.rol === "estudiante") && user.rut === rutQuery) {
        return next(); // Vocalía y estudiante solo pueden editarse a sí mismos
    }
    return handleErrorClient(res, 403, "No tienes permisos suficientes para editar este usuario.");
}
