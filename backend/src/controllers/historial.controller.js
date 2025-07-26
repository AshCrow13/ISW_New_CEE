"use strict";
import Historial from "../entity/historial.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js"; 
import { getHistorialService } from "../services/historial.service.js";

export async function getHistorial(req, res) {
    try { // Validar que la consulta cumpla con el esquema
        const [historial, err] = await getHistorialService(req.query);
        if (err) return handleErrorClient(res, 400, err); // Error en la consulta

        handleSuccess(res, 200, "Historial obtenido correctamente", historial);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}