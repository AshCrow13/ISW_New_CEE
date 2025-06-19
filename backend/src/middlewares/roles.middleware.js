"use strict";
import Estudiante from "../entity/estudiante.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { 
    handleErrorClient, 
    handleErrorServer 
} from "../handlers/responseHandlers.js";

export function hasRoles(roles = []) {
    return async function (req, res, next) {
        try {
        if (!req.user || !req.user.email) {
            return handleErrorClient(res, 401, "No autenticado o usuario no válido.");
        }

        const repo = AppDataSource.getRepository(Estudiante);
        const userFound = await repo.findOneBy({ email: req.user.email });
        if (!userFound) // Si no se encuentra el usuario
            return handleErrorClient(res, 404, "Usuario no encontrado.");

        if (!roles.includes(userFound.rol)) { // Si el rol del usuario no está en los roles permitidos
            return handleErrorClient(
            res,
            403,
            "No tienes permisos suficientes para acceder a este recurso.",
            { rolesRequeridos: roles, tuRol: userFound.rol }
            );
        }
        next();
        } catch (error) {
        handleErrorServer(res, 500, error.message);
        }
    };
}
