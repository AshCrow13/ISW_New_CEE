"use strict";
import Documento from "../entity/documento.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Historial from "../entity/historial.entity.js";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual,  } from "typeorm";

// CREATE
export async function createDocumentoService(data, usuario) {
    try {
        // Validar que el cuerpo de la solicitud cumpla con el esquema
        const repo = AppDataSource.getRepository(Documento);
        const documento = repo.create(data);
        await repo.save(documento);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "crear",
            tipo: "documento",
            referenciaId: documento.id
        });

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

        // Filtro por tipo
        if (filtro.tipo) where.tipo = filtro.tipo;

        // Filtro por rango de fechas de subida
        if (filtro.fechaInicio && filtro.fechaFin) {
            where.fechaSubida = Between(filtro.fechaInicio, filtro.fechaFin);
        } else if (filtro.fechaInicio) {
            where.fechaSubida = MoreThanOrEqual(filtro.fechaInicio);
        } else if (filtro.fechaFin) {
            where.fechaSubida = LessThanOrEqual(filtro.fechaFin);
        }

        // Búsqueda textual
        // Usar createQueryBuilder para mayor flexibilidad
        let queryBuilder = repo.createQueryBuilder("documento").where(where);

        if (filtro.q) {
            queryBuilder = queryBuilder.andWhere(
                "(documento.titulo ILIKE :q OR documento.descripcion ILIKE :q)",
                { q: `%${filtro.q}%` }
            );
        }
        
        //Ordenamiento flexible
        // Por defecto ordena por fecha de subida descendente
        let order = { fechaSubida: "DESC" };
        if (filtro.orderBy) {
            const [campo, dir] = filtro.orderBy.split("_");
            order = { [campo]: dir.toUpperCase() === "DESC" ? "DESC" : "ASC" };
        }
        queryBuilder = queryBuilder.orderBy(order);
        
        // Paginación
        // Si no se especifica, por defecto toma 20 documentos y empieza desde el 0
        const limit = filtro.limit ? parseInt(filtro.limit) : 20;
        const offset = filtro.offset ? parseInt(filtro.offset) : 0;
        queryBuilder = queryBuilder.skip(offset).take(limit);

        const documentos = await queryBuilder.getMany();
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
export async function updateDocumentoService(query, data, usuario) {
    try {
        // Validar que la consulta y el cuerpo de la solicitud cumplan con los esquemas
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: query });
        if (!documento) return [null, "Documento no encontrado"];
        Object.assign(documento, data); // Actualizar solo los campos de texto
        await repo.save(documento);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "editar",
            tipo: "documento",
            referenciaId: documento.id
        });

        return [documento, null];
    } catch (error) {
        return [null, "Error al actualizar documento: " + error.message];
    }
}

// DELETE
export async function deleteDocumentoService(query, usuario) {
    try {
        // Validar que la consulta cumpla con el esquema
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: query });
        if (!documento) return [null, "Documento no encontrado"]; // Si no se encuentra el documento, retornar error
        await repo.remove(documento);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "eliminar",
            tipo: "documento",
            referenciaId: documento.id
        });

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