"use strict";
import Historial from "../entity/historial.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js"; 
import { getHistorialService } from "../services/historial.service.js";

// GET - Obtener historial de acciones del sistema
export async function getHistorial(req, res) {
    try {
        // Llamar al servicio para obtener el historial, aplicando filtros si existen
        const [historial, err] = await getHistorialService(req.query);
        if (err) return handleErrorClient(res, 400, err); // Error en la consulta o filtros

        // Responder con la lista de acciones del historial
        handleSuccess(res, 200, "Historial obtenido correctamente", historial);
    } catch (error) {
        // Manejar errores inesperados del servidor
        handleErrorServer(res, 500, error.message);
    }
}