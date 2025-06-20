import Historial from "../entity/historial.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual,  } from "typeorm";

// READ (con filtro)
// Esta función obtiene el historial de acciones realizadas en la aplicación
export async function getHistorialService(filtro = {}) {
    try {
        const repo = AppDataSource.getRepository(Historial);
        const where = {};

        if (filtro.usuario) where.usuario = Like(`%${filtro.usuario}%`);
        if (filtro.accion) where.accion = filtro.accion;
        if (filtro.tipo) where.tipo = filtro.tipo;
        if (filtro.referenciaId) where.referenciaId = parseInt(filtro.referenciaId);

        // Filtro por fecha (supongamos que el campo es 'fecha')
        if (filtro.fechaInicio && filtro.fechaFin) {
            where.fecha = Between(filtro.fechaInicio, filtro.fechaFin);
        } else if (filtro.fechaInicio) {
            where.fecha = MoreThanOrEqual(filtro.fechaInicio);
        } else if (filtro.fechaFin) {
            where.fecha = LessThanOrEqual(filtro.fechaFin);
        }

        const historial = await repo.find({ where, order: { fecha: "DESC" } });
        return [historial, null];
    } catch (error) {
        return [null, "Error al obtener historial: " + error.message];
    }
}
