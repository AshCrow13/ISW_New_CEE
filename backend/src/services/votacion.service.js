"use strict"
import votacionSchema from "../entity/votacion.entity.js";
import opcionesSchema from "../entity/opciones.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function postVotacion(body) {
    try {
        const votacionRepository = AppDataSource.getRepository(votacionSchema);
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);

        const {nombre, estado,inicio, duracion, fin, opciones} = body;

        const nuevaVotacion = votacionRepository.create({ nombre, estado, inicio, duracion, fin });
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
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);
        const votacionToDelete = await votacionRepository.findOne({ 
            where: { id },
            relations: ["opciones"] // Incluir las opciones relacionadas
        });
        if (!votacionToDelete) return [null, "Votación no encontrada"];
        // Eliminar las opciones asociadas a la votación
        if (votacionToDelete.opciones && votacionToDelete.opciones.length > 0) {
            await opcionesRepository.remove(votacionToDelete.opciones);
        }
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
            relations: ["opciones"], // Incluir las opciones relacionadas
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
        const votaciones = await votacionRepository.find({
            relations: ["opciones"], // Incluir las opciones relacionadas
        });
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
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);
        
        // Buscar la votación existente con sus opciones
        const votacionToUpdate = await votacionRepository.findOne({
            where: { id },
            relations: ["opciones"]
        });
        
        if (!votacionToUpdate) return [null, "Votación no encontrada"];

        // Extraer opciones del body para manejarlas por separado
        const { opciones, duracion, ...otrosDataos } = body;
        
        // Actualizar campos básicos de la votación
        Object.assign(votacionToUpdate, otrosDataos);
        
        // Si se proporciona duración, recalcular fecha de fin
        if (duracion !== undefined) {
            votacionToUpdate.duracion = duracion;
            const fechaInicio = new Date(votacionToUpdate.inicio);
            votacionToUpdate.fin = new Date(fechaInicio.getTime() + duracion * 60000);
        }

        // Guardar la votación actualizada
        const votacionActualizada = await votacionRepository.save(votacionToUpdate);

        // Si se proporcionan nuevas opciones, actualizar
        if (opciones && Array.isArray(opciones)) {
            // Eliminar opciones existentes
            if (votacionToUpdate.opciones && votacionToUpdate.opciones.length > 0) {
                await opcionesRepository.remove(votacionToUpdate.opciones);
            }

            // Crear nuevas opciones
            const nuevasOpciones = await Promise.all(
                opciones.map(texto =>
                    opcionesRepository.save(
                        opcionesRepository.create({
                            texto,
                            votacion: votacionActualizada,
                        })
                    )
                )
            );

            votacionActualizada.opciones = nuevasOpciones;
        }

        // Recargar la votación con las opciones actualizadas
        const votacionFinal = await votacionRepository.findOne({
            where: { id },
            relations: ["opciones"]
        });

        return [votacionFinal, null];
    } catch (error) {
        console.error("Error al actualizar la votación:", error);
        return [null, "Error interno del servidor"];
    }
}
