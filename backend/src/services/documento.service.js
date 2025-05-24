"use strict";
import Documento from "../entity/documento.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createDocumentoService(data, user) {
    try {
        const docRepo = AppDataSource.getRepository(Documento);

        const nuevoDocumento = docRepo.create({
        titulo: data.titulo,
        tipo: data.tipo,
        urlArchivo: data.urlArchivo, // Debe venir del middleware de subida de archivos
        subidoPor: user ? user.nombreCompleto : data.subidoPor,
        id_actividad: data.id_actividad || null,
        fechaSubida: new Date(),
        });

        await docRepo.save(nuevoDocumento);

        return [nuevoDocumento, null];
    } catch (error) {
        return [null, "Error al crear documento: " + error.message];
    }
}

export async function getDocumentosService(filtro = {}) {
    try {
        const docRepo = AppDataSource.getRepository(Documento);

        // Puedes agregar filtros por tipo, id_actividad, etc.
        const where = {};
        if (filtro.tipo) where.tipo = filtro.tipo;
        if (filtro.id_actividad) where.id_actividad = filtro.id_actividad;

        const documentos = await docRepo.find({
        where,
        order: { fechaSubida: "DESC" },
        });

        return [documentos, null];
    } catch (error) {
        return [null, "Error al obtener documentos: " + error.message];
    }
}

export async function getDocumentoByIdService(id) {
    try {
        const docRepo = AppDataSource.getRepository(Documento);
        const documento = await docRepo.findOneBy({ id: parseInt(id) });
        if (!documento) return [null, "Documento no encontrado"];
        return [documento, null];
    } catch (error) {
        return [null, "Error al buscar el documento: " + error.message];
    }
}

export async function updateDocumentoService(id, data) {
    try {
        const docRepo = AppDataSource.getRepository(Documento);
        const documento = await docRepo.findOneBy({ id: parseInt(id) });
        if (!documento) return [null, "Documento no encontrado"];

        Object.assign(documento, data, { fechaSubida: new Date() });

        await docRepo.save(documento);

        return [documento, null];
    } catch (error) {
        return [null, "Error al actualizar el documento: " + error.message];
    }
}

export async function deleteDocumentoService(id) {
    try {
        const docRepo = AppDataSource.getRepository(Documento);
        const documento = await docRepo.findOneBy({ id: parseInt(id) });
        if (!documento) return [null, "Documento no encontrado"];
        await docRepo.remove(documento);
        return [documento, null];
    } catch (error) {
        return [null, "Error al eliminar el documento: " + error.message];
    }
}
