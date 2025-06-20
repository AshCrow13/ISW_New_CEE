"use strict";
import Estudiante from "../entity/estudiante.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export function hasCarreras(carreras = []) {
    return async function (req, res, next) {
        try {
            if (!req.user || !req.user.carrera) {
                return handleErrorClient(res, 400, "No se ha proporcionado la carrera del usuario.");
            }
            const repo = AppDataSource.getRepository(Estudiante);
            const userFound = await repo.findOneBy({ email: req.user.email });
            if (!userFound) // Si no se encuentra el usuario
            return handleErrorClient(res, 404, "Usuario no encontrado.");
            const carrera = req.user.carrera;

            if (typeof carrera !== "string" || carrera.trim() === "") {
                return handleErrorClient(res, 400, "La carrera debe ser una cadena de texto no vacía.");
            }

            if (!carreras.includes(carrera)) {
                return handleErrorClient(
                    res,
                    403,
                    "No tienes acceso a este recurso por tu carrera.",
                    { carrerasPermitidas: carreras, tuCarrera: carrera }
                );
            }

            next();
        } catch (error) {
            handleErrorServer(res, 500, error.message);
        }
    };
}