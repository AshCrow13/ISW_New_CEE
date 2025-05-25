"use strict";
import Actividad from "../entity/actividad.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createActividadService(data, user) {
    try {
        const actividadRepo = AppDataSource.getRepository(Actividad);

        const nuevaActividad = actividadRepo.create({
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha: data.fecha,
        lugar: data.lugar,
        categoria: data.categoria,
        responsable: user ? user.nombreCompleto : data.responsable,
        recursos: data.recursos,
        estado: "publicada",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

        await actividadRepo.save(nuevaActividad);

        return [nuevaActividad, null];
    } catch (error) {
        return [null, "Error al crear actividad: " + error.message];
    }
}

export async function getActividadesService() {
    try {
        const actividadRepo = AppDataSource.getRepository(Actividad);
        const actividades = await actividadRepo.find({ order: { fecha: "ASC" } });
        return [actividades, null];
    } catch (error) {
        return [null, "Error al obtener actividades: " + error.message];
    }
}

export async function getActividadByIdService(id) {
    try {
        const actividadRepo = AppDataSource.getRepository(Actividad);
        const actividad = await actividadRepo.findOneBy({ id: parseInt(id) });
        if (!actividad) return [null, "Actividad no encontrada"];
        return [actividad, null];
    } catch (error) {
        return [null, "Error al buscar la actividad: " + error.message];
    }
}

export async function updateActividadService(id, data) {
    try {
        const actividadRepo = AppDataSource.getRepository(Actividad);
        const actividad = await actividadRepo.findOneBy({ id: parseInt(id) });
        if (!actividad) return [null, "Actividad no encontrada"];

        Object.assign(actividad, data, { updatedAt: new Date() });

        await actividadRepo.save(actividad);

        return [actividad, null];
    } catch (error) {
        return [null, "Error al actualizar la actividad: " + error.message];
    }
}

export async function deleteActividadService(id) {
    try {
        const actividadRepo = AppDataSource.getRepository(Actividad);
        const actividad = await actividadRepo.findOneBy({ id: parseInt(id) });
        if (!actividad) return [null, "Actividad no encontrada"];
        await actividadRepo.remove(actividad);
        return [actividad, null];
    } catch (error) {
        return [null, "Error al eliminar la actividad: " + error.message];
    }
}
