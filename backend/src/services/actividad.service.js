"use strict";
import Actividad from "../entity/actividad.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Historial from "../entity/historial.entity.js";

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
        if (filtro.categoria) where.categoria = filtro.categoria;
        if (filtro.fecha) where.fecha = filtro.fecha;
        const actividades = await repo.find({ where, order: { fecha: "ASC" } });
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