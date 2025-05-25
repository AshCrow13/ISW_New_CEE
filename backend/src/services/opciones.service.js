"use strict"
import {opcionesSchema} from "../entity/opciones.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function postOpcion(body) {
    try {
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);
        const newOpcion = opcionesRepository.create(body);
        const savedOpcion = await opcionesRepository.save(newOpcion);
        return [savedOpcion, null];
    } catch (error) {
        console.error("Error al crear la opción:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteOpcion(id) {
    try {
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);
        const opcionToDelete = await opcionesRepository.findOneBy({ id });
        if (!opcionToDelete) return [null, "Opción no encontrada"];
        await opcionesRepository.remove(opcionToDelete);
        return [opcionToDelete, null];
    } catch (error) {
        console.error("Error al eliminar la opción:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getOpcion(query) {
    try {
        const { id, texto } = query;
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);
        const opcionFound = await opcionesRepository.findOne({
            where: [{ id: id }, { texto: texto }],
        });
        if (!opcionFound) return [null, "Opción no encontrada"];
        return [opcionFound, null];
    } catch (error) {
        console.error("Error al obtener la opción:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getOpciones() {
    try {
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);
        const opciones = await opcionesRepository.find();
        if (!opciones || opciones.length === 0) return [null, "No hay opciones"];
        return [opciones, null];
    } catch (error) {
        console.error("Error al obtener las opciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateOpcion(id, body) {
    try {
        const opcionesRepository = AppDataSource.getRepository(opcionesSchema);
        const opcionToUpdate = await opcionesRepository.findOneBy({ id });
        if (!opcionToUpdate) return [null, "Opción no encontrada"];
        opcionesRepository.merge(opcionToUpdate, body);
        const updatedOpcion = await opcionesRepository.save(opcionToUpdate);
        return [updatedOpcion, null];
    } catch (error) {
        console.error("Error al actualizar la opción:", error);
        return [null, "Error interno del servidor"];
    }
}