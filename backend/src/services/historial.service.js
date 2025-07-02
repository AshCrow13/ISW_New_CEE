import Historial from "../entity/historial.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

// Esta función obtiene el historial de acciones realizadas, con filtros
export async function getHistorialService(filtro = {}) {
    try { 
        const repo = AppDataSource.getRepository(Historial); // Obtenemos el repositorio de Historial
        const where = {};

        // Filtrar por email del usuario relacionado
        if (filtro.usuarioEmail) { // Si se proporciona un email de usuario
            where.usuario = { email: filtro.usuarioEmail };
        } else if (filtro.usuarioId) { // Si se proporciona un ID de usuario
            where.usuario = { id: parseInt(filtro.usuarioId) };
        }
        if (filtro.accion) where.accion = filtro.accion; // Filtrar por acción
        if (filtro.tipo) where.tipo = filtro.tipo; // Filtrar por tipo
        if (filtro.referenciaId) where.referenciaId = parseInt(filtro.referenciaId); // Filtrar por ID de referencia

        // Filtrar por fecha
        if (filtro.fechaInicio && filtro.fechaFin) {
            where.fecha = Between(filtro.fechaInicio, filtro.fechaFin);
        } else if (filtro.fechaInicio) {
            where.fecha = MoreThanOrEqual(filtro.fechaInicio);
        } else if (filtro.fechaFin) {
            where.fecha = LessThanOrEqual(filtro.fechaFin);
        }

        // Historial filtrado y ordenado por fecha descendente
        const historial = await repo.find({ where, order: { fecha: "DESC" }, relations: ["usuario"] }); 
        return [historial, null];
    } catch (error) {
        return [null, "Error al obtener historial: " + error.message];
    }
}
