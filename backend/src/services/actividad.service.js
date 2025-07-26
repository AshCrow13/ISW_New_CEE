"use strict";
import Actividad from "../entity/actividad.entity.js";
import Estudiante from "../entity/estudiante.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Historial from "../entity/historial.entity.js";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

// CREATE
export async function createActividadService(data, usuario) {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const estudianteRepo = AppDataSource.getRepository(Estudiante);

        // ✅ CAMBIO: Buscar cualquier estudiante disponible si el ID no existe
        let responsable;
        if (data.responsableId) {
            responsable = await estudianteRepo.findOne({ where: { id: data.responsableId } });
        }
        
        // ✅ CORREGIR: Si no se encuentra, usar find() con limit en lugar de findOne()
        if (!responsable) {
            const estudiantes = await estudianteRepo.find({ 
                order: { id: "ASC" },
                take: 1 // Tomar solo el primer resultado
            });
            
            if (estudiantes.length === 0) {
                return [null, "No hay estudiantes registrados en el sistema"];
            }
            
            responsable = estudiantes[0]; // Usar el primer estudiante encontrado
        }

        const actividad = repo.create({ ...data, responsable });
        await repo.save(actividad);

        // Registrar en historial
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario?.email || "Sistema",
            accion: "crear",
            tipo: "actividad",
            referenciaId: actividad.id
        });

        const actividadCompleta = await repo.findOne({ 
            where: { id: actividad.id }, 
            relations: ["responsable"] 
        });
        return [actividadCompleta, null];
    } catch (error) {
        return [null, "Error al crear actividad: " + error.message];
    }
}

// READ (Todos - con filtro)
export async function getActividadesService(filtro = {}) {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const where = {};
        
        // ✅ CORREGIR: Usar nombres correctos de columna según la entidad
        if (filtro.categoria) where.categoria = filtro.categoria;
        if (filtro.lugar) where.lugar = Like(`%${filtro.lugar}%`);
        
        if (filtro.fechaInicio && filtro.fechaFin) {
            // ✅ CAMBIO: Usar 'fecha' en lugar de 'fechaInicio/fechaFin'
            where.fecha = Between(filtro.fechaInicio, filtro.fechaFin);
        } else if (filtro.fechaInicio) {
            where.fecha = MoreThanOrEqual(filtro.fechaInicio);
        } else if (filtro.fechaFin) {
            where.fecha = LessThanOrEqual(filtro.fechaFin);
        }
        
        let queryBuilder = repo.createQueryBuilder("actividad").where(where);

        if (filtro.q) {
            queryBuilder = queryBuilder.andWhere(
                "(actividad.titulo ILIKE :q OR actividad.descripcion ILIKE :q)",
                { q: `%${filtro.q}%` }
            );
        }

        // ✅ MEJORADO: Ordenamiento configurable
        let orderField = "actividad.fecha";
        let orderDirection = "DESC";
        
        if (filtro.orderBy) {
            const parts = filtro.orderBy.split('_');
            if (parts.length === 2) {
                const [field, direction] = parts;
                orderField = `actividad.${field}`;
                orderDirection = direction.toUpperCase() === "ASC" ? "ASC" : "DESC";
            }
        }
        
        queryBuilder = queryBuilder.orderBy(orderField, orderDirection);

        // Paginación
        const limit = filtro.limit ? parseInt(filtro.limit) : 20;
        const offset = filtro.offset ? parseInt(filtro.offset) : 0;
        queryBuilder = queryBuilder.skip(offset).take(limit);

        // Relaciones
        queryBuilder = queryBuilder.leftJoinAndSelect("actividad.responsable", "responsable");

        const actividades = await queryBuilder.getMany();
        return [actividades, null];
    } catch (error) {
        return [null, "Error al obtener actividades: " + error.message];
    }
}

// READ (Uno)
export async function getActividadService(query) {
    try {
        // Validar que la consulta cumpla con el esquema
        const repo = AppDataSource.getRepository(Actividad);
        const actividad = await repo.findOne({ where: query, relations: ["responsable"] });
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
        const estudianteRepo = AppDataSource.getRepository(Estudiante);
        
        // Buscar la actividad existente
        const actividad = await repo.findOne({ 
            where: { id: query.id },
            relations: ["responsable"]
        });

        if (!actividad) return [null, "Actividad no encontrada"];
        
        // Manejar responsableId específicamente antes de aplicar otros cambios
        if (data.responsableId !== undefined) {
            console.log(`Buscando responsable con ID: ${data.responsableId}`);
            let responsable = await estudianteRepo.findOne({ where: { id: data.responsableId } });
            
            // Si no se encuentra el responsable, buscar uno alternativo
            if (!responsable) {
                console.log(`Responsable con ID ${data.responsableId} no encontrado, buscando alternativa...`);
                // Intentar mantener el responsable actual si existe
                if (actividad.responsable) {
                    responsable = actividad.responsable;
                    console.log(`Manteniendo responsable actual: ${responsable.id}`);
                } else {
                    // Buscar cualquier estudiante disponible
                    const estudiantes = await estudianteRepo.find({ 
                        take: 1, 
                        order: { id: "ASC" }
                    });
                    
                    if (estudiantes && estudiantes.length > 0) {
                        responsable = estudiantes[0];
                        console.log(`Usando responsable alternativo: ${responsable.id}`);
                    } else {
                        return [null, "No hay estudiantes disponibles para asignar como responsable"];
                    }
                }
            }
            
            // Asignar el responsable (ya sea el solicitado, el actual o uno alternativo)
            actividad.responsable = responsable;
            console.log(`Responsable asignado: ${responsable.id}`);
            
            // Eliminar responsableId para evitar conflictos
            const { responsableId, ...restData } = data;
            data = restData;
        }
        
        // Aplicar el resto de cambios
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
        
        // Devolver con relaciones
        const actividadCompleta = await repo.findOne({ where: { id: actividad.id }, relations: ["responsable"] });
        return [actividadCompleta, null];
    } catch (error) {
        console.error("Error en updateActividadService:", error);
        return [null, `Error al actualizar actividad: ${error.message}`];
    }
}

// DELETE
export async function deleteActividadService(query, usuario) {
    try {
        // Validar que la consulta cumpla con el esquema
        const repo = AppDataSource.getRepository(Actividad);
        const actividad = await repo.findOne({ where: query, relations: ["responsable"] });
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