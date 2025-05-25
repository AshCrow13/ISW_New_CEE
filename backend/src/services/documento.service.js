"use strict";
import Documento from "../entity/documento.entity.js";
import { AppDataSource } from "../config/configDb.js";

// CREATE
export async function createDocumentoService(data) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const documento = repo.create(data);
        await repo.save(documento);
        return [documento, null];
    } catch (error) {
        return [null, "Error al crear documento: " + error.message];
    }
}

// READ (Todos)
export async function getDocumentosService(filtro = {}) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const where = {};
        if (filtro.tipo) where.tipo = filtro.tipo;
        if (filtro.id_actividad) where.id_actividad = filtro.id_actividad;
        const documentos = await repo.find({ where, order: { fechaSubida: "DESC" } });
        return [documentos, null];
    } catch (error) {
        return [null, "Error al obtener documentos: " + error.message];
    }  
}

// READ (Uno)
export async function getDocumentoService(query) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: query });
        if (!documento) return [null, "Documento no encontrado"];
        return [documento, null];
    } catch (error) {
        return [null, "Error al buscar documento: " + error.message];
    }
}

// UPDATE
export async function updateDocumentoService(query, data) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: query });
        if (!documento) return [null, "Documento no encontrado"];
        Object.assign(documento, data);
        await repo.save(documento);
        return [documento, null];
    } catch (error) {
        return [null, "Error al actualizar documento: " + error.message];
    }
}

// DELETE
export async function deleteDocumentoService(query) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: query });
        if (!documento) return [null, "Documento no encontrado"];
        await repo.remove(documento);
        return [documento, null];
    } catch (error) {
        return [null, "Error al eliminar documento: " + error.message];
    }
}

/*
// DELETE (Por ID)
export async function deleteDocumentoByIdService(id) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: { id } });
        if (!documento) return [null, "Documento no encontrado"];
        await repo.remove(documento);
        return [documento, null];
    } catch (error) {
        return [null, "Error al eliminar documento: " + error.message];
    }
}
// DELETE (Por ID y Tipo)
export async function deleteDocumentoByIdAndTipoService(id, tipo) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: { id, tipo } });
        if (!documento) return [null, "Documento no encontrado"];
        await repo.remove(documento);
        return [documento, null];
    } catch (error) {
        return [null, "Error al eliminar documento: " + error.message];
    }
}

// DELETE (Por ID y Actividad)
export async function deleteDocumentoByIdAndActividadService(id, id_actividad) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: { id, id_actividad } });
        if (!documento) return [null, "Documento no encontrado"];
        await repo.remove(documento);
        return [documento, null];
    } catch (error) {
        return [null, "Error al eliminar documento: " + error.message];
    }
}
*/