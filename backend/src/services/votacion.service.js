"use strict"
import votacionSchema from "../entity/votacion.entity.js";
import opcionesSchema from "../entity/opcionVotacion.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function postVotacion(body) {
    try {
        const votacionRepository = AppDataSource.getRepository(votacionSchema);
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);

        const {nombre, estado, opciones} = body;

        const nuevaVotacion = votacionRepository.create({ nombre, estado });
        const guardarVotacion = await votacionRepository.save(nuevaVotacion);

        let opcionesVotacion = [];
        if(Array.isArray(opciones) && opciones.length > 0) {
                opcionesVotacion = await Promise.all(
                    opciones.map(texto =>
                        opcionesRepository.save(
                            opcionesRepository.create({
                                texto,
                                votacion:guardarVotacion,
                            })
                        )
                    )
                );
        }
        return [{ ...guardarVotacion,opciones:opcionesVotacion}, null];
    } catch (error) {
        console.error("Error al crear la votación:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteVotacion(id) {
    try {
        const votacionRepository = AppDataSource.getRepository(votacionSchema);
        const votacionToDelete = await votacionRepository.findOneBy({ id });
        if (!votacionToDelete) return [null, "Votación no encontrada"];
        await votacionRepository.remove(votacionToDelete);
        return [votacionToDelete, null];
    } catch (error) {
        console.error("Error al eliminar la votación:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getVotacion(query) {
    try {
        const { id, nombre } = query;
        const votacionRepository = AppDataSource.getRepository(votacionSchema);
        const votacionFound = await votacionRepository.findOne({
            where: [{ id: id }, { nombre: nombre }],
        });
        if (!votacionFound) return [null, "Votación no encontrada"];
        return [votacionFound, null];
    } catch (error) {
        console.error("Error al obtener la votación:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getVotaciones() {
    try {
        const votacionRepository = AppDataSource.getRepository(votacionSchema);
        const votaciones = await votacionRepository.find();
        if (!votaciones || votaciones.length === 0) return [null, "No hay votaciones"];
        return [votaciones, null];
    } catch (error) {
        console.error("Error al obtener las votaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateVotacion(id, body) {
    try {
        const votacionRepository = AppDataSource.getRepository(votacionSchema);
        const votacionToUpdate = await votacionRepository.findOneBy({ id });
        if (!votacionToUpdate) return [null, "Votación no encontrada"];
        const updatedVotacion = { ...votacionToUpdate, ...body };
        await votacionRepository.save(updatedVotacion);
        return [updatedVotacion, null];
    } catch (error) {
        console.error("Error al actualizar la votación:", error);
        return [null, "Error interno del servidor"];
    }
}
