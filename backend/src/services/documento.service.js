"use strict";
import Documento from "../entity/documento.entity.js";
import Actividad from "../entity/actividad.entity.js";
import Estudiante from "../entity/estudiante.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Historial from "../entity/historial.entity.js";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

// CREATE
export async function createDocumentoService(data, usuario) {
    try {
        const repo = AppDataSource.getRepository(Documento);
        const estudianteRepo = AppDataSource.getRepository(Estudiante);
        const actividadRepo = AppDataSource.getRepository(Actividad);

        // ✅ BUSCAR por email en lugar de por ID
        const subidoPor = await estudianteRepo.findOne({ where: { email: data.subidoPor } });
        if (!subidoPor) return [null, "Usuario que sube el documento no existe"];

        // Relacionar actividad (opcional)
        let actividad = null;
        if (data.id_actividad) {
            actividad = await actividadRepo.findOne({ where: { id: data.id_actividad } });
            if (!actividad) return [null, "Actividad no existe"];
        }

        // Crear documento
        const documento = repo.create({ 
            titulo: data.titulo,
            tipo: data.tipo,
            urlArchivo: data.urlArchivo,
            subidoPor, 
            actividad 
        });
        await repo.save(documento);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "crear",
            tipo: "documento",
            referenciaId: documento.id
        });

        // Devolver documento con relaciones
        const docCompleto = await repo.findOne({ where: { id: documento.id }, relations: ["subidoPor", "actividad"] });
        return [docCompleto, null];
    } catch (error) {
        return [null, "Error al crear documento: " + error.message];
    }
}

// READ (Todos)
export async function getDocumentosService(filtro = {}) {
    try {
        // Validar que el filtro cumpla con el esquema
        const repo = AppDataSource.getRepository(Documento);
        const where = {};
        // Filtros básicos
        if (filtro.tipo) where.tipo = filtro.tipo;
        if (filtro.fechaInicio && filtro.fechaFin) {
            // ✅ USAR EL NOMBRE CORRECTO DE LA COLUMNA
            where.fechaSubida = Between(filtro.fechaInicio, filtro.fechaFin);
        } else if (filtro.fechaInicio) {
            where.fechaSubida = MoreThanOrEqual(filtro.fechaInicio);
        } else if (filtro.fechaFin) {
            where.fechaSubida = LessThanOrEqual(filtro.fechaFin);
        }

        // Construir consulta
        let queryBuilder = repo.createQueryBuilder("documento").where(where);
        if (filtro.q) {
            queryBuilder = queryBuilder.andWhere(
                "(documento.titulo ILIKE :q)", // ✅ ELIMINAR referencia a descripcion que no existe
                { q: `%${filtro.q}%` }
            );
        }

        // Ordenamiento - ✅ USAR EL NOMBRE CORRECTO
        let order = "documento.fechaSubida";
        let direction = "DESC";
        
        if (filtro.orderBy) {
            const [campo, dir] = filtro.orderBy.split("_");
            order = `documento.${campo}`;
            direction = dir.toUpperCase() === "DESC" ? "DESC" : "ASC";
        }
        
        queryBuilder = queryBuilder.orderBy(order, direction);

        // Paginación
        const limit = filtro.limit ? parseInt(filtro.limit) : 20;
        const offset = filtro.offset ? parseInt(filtro.offset) : 0;
        queryBuilder = queryBuilder.skip(offset).take(limit);

        // Relaciones
        queryBuilder = queryBuilder
            .leftJoinAndSelect("documento.subidoPor", "subidoPor")
            .leftJoinAndSelect("documento.actividad", "actividad");

        // Ejecutar consulta
        const documentos = await queryBuilder.getMany();
        return [documentos, null];
    } catch (error) {
        return [null, "Error al obtener documentos: " + error.message];
    }
}

// READ (Uno)
export async function getDocumentoService(query) {
    try {
        // Validar que la consulta cumpla con el esquema
        const repo = AppDataSource.getRepository(Documento);
        // Buscar documento con relaciones
        const documento = await repo.findOne({ where: query, relations: ["subidoPor", "actividad"] }); 
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
        const estudianteRepo = AppDataSource.getRepository(Estudiante);
        const actividadRepo = AppDataSource.getRepository(Actividad);
        // Buscar documento with relaciones
        const documento = await repo.findOne({ where: query, relations: ["subidoPor", "actividad"] });
        if (!documento) return [null, "Documento no encontrado"];

        // Si cambia el subidoPor
        if (data.subidoPorId) {
            const subidoPor = await estudianteRepo.findOne({ where: { id: data.subidoPorId } });
            if (!subidoPor) return [null, "Usuario subidor no encontrado"];
            documento.subidoPor = subidoPor;
        }
        // Si cambia la actividad
        if (data.id_actividad) {
            const actividad = await actividadRepo.findOne({ where: { id: data.id_actividad } });
            if (!actividad) return [null, "Actividad no encontrada"];
            documento.actividad = actividad;
        }

        // Actualizar otros campos
        Object.assign(documento, data);
        await repo.save(documento);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "editar",
            tipo: "documento",
            referenciaId: documento.id
        });

        // Devolver con relaciones
        const docCompleto = await repo.findOne({ where: { id: documento.id }, relations: ["subidoPor", "actividad"] });
        return [docCompleto, null];
    } catch (error) {
        return [null, "Error al actualizar documento: " + error.message];
    }
}

// DELETE
export async function deleteDocumentoService(query, usuario) {
    try {
        // Validar que la consulta cumpla con el esquema
        const repo = AppDataSource.getRepository(Documento);
        // Buscar documento con relaciones
        const documento = await repo.findOne({ where: query, relations: ["subidoPor", "actividad"] });
        if (!documento) return [null, "Documento no encontrado"];
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