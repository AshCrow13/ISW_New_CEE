"use strict";
import Historial from "../entity/historial.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleErrorServer, handleSuccess  } from "../handlers/responseHandlers.js";

export async function getHistorial(req, res) {
    try {
        const historialRepo = AppDataSource.getRepository(Historial);
        const historial = await historialRepo.find({ order: { fecha: "DESC" } });
        handleSuccess(res, 200, "Historial obtenido correctamente", historial);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
