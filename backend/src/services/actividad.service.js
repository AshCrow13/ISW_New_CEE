"use strict";
import Actividad from "../entity/actividad.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Historial from "../entity/historial.entity.js";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual,  } from "typeorm";

// CREATE
export async function createActividadService(data, usuario) {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const actividad = repo.create(data);
        await repo.save(actividad);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "crear",
            tipo: "actividad",
            referenciaId: actividad.id
        });

        return [actividad, null];
    } catch (error) {
        return [null, "Error al crear actividad: " + error.message];
    }
}

// READ (Todos - con filtro)
export async function getActividadesService(filtro = {}) {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const where = {};

        // Filtro por categoría
        if (filtro.categoria) where.categoria = filtro.categoria;

        // Filtro por rango de fechas
        if (filtro.fechaInicio && filtro.fechaFin) {
            where.fecha = Between(filtro.fechaInicio, filtro.fechaFin);
        } else if (filtro.fechaInicio) {
            where.fecha = MoreThanOrEqual(filtro.fechaInicio);
        } else if (filtro.fechaFin) {
            where.fecha = LessThanOrEqual(filtro.fechaFin);
        }

        // Búsqueda por texto en título o descripción
        let actividades;
        if (filtro.q) {
            actividades = await repo
                .createQueryBuilder("actividad")
                .where(where)
                .andWhere(
                    "(actividad.titulo ILIKE :q OR actividad.descripcion ILIKE :q)",
                    { q: `%${filtro.q}%` }
                )
                .orderBy("actividad.fecha", "DESC")
                .getMany();
        } else {
            actividades = await repo.find({ where, order: { fecha: "DESC" } });
        }
        return [actividades, null];
    } catch (error) {
        return [null, "Error al obtener actividades: " + error.message];
    }
}

// READ (Uno)
export async function getActividadService(query) {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const actividad = await repo.findOne({ where: query });
        if (!actividad) return [null, "Actividad no encontrada"];
        return [actividad, null];
    } catch (error) {
        return [null, "Error al buscar actividad: " + error.message];
    }
}

// UPDATE
export async function updateActividadService(query, data, usuario) {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const actividad = await repo.findOne({ where: query });
        if (!actividad) return [null, "Actividad no encontrada"];
        Object.assign(actividad, data, { updatedAt: new Date() });
        await repo.save(actividad);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "editar",
            tipo: "actividad",
            referenciaId: actividad.id
        });

        return [actividad, null];
    } catch (error) {
        return [null, "Error al actualizar actividad: " + error.message];
    }
}

// DELETE
export async function deleteActividadService(query, usuario) {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const actividad = await repo.findOne({ where: query });
        if (!actividad) return [null, "Actividad no encontrada"];
        await repo.remove(actividad);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "eliminar",
            tipo: "actividad",
            referenciaId: actividad.id
        });

        return [actividad, null];
    } catch (error) {
        return [null, "Error al eliminar actividad: " + error.message];
    }
}

/*
// DELETE (Múltiples)
export async function deleteActividadesService(query) {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const actividades = await repo.find({ where: query });
        if (actividades.length === 0) return [null, "No se encontraron actividades para eliminar"];
        await repo.remove(actividades);
        return [actividades, null];
    } catch (error) {
        return [null, "Error al eliminar actividades: " + error.message];
    }
}
*/