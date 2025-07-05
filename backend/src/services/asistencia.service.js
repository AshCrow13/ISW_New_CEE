"use strict";
import Asistencia from "../entity/asistencia.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Create
export async function createAsistenciaService(data) {
    try {
        const repo = AppDataSource.getRepository(Asistencia);
        
        // Verificar si ya existe una asistencia con el mismo correo e idInstancia
        const asistenciaExistente = await repo.findOne({
            where: {
                correo: data.correo,
                idInstancia: data.idInstancia
            }
        });
        
        if (asistenciaExistente) {
            return [null, "Ya existe una asistencia registrada para este estudiante en esta instancia"];
        }
        
        const asistencia = repo.create(data);
        const resultado = await repo.save(asistencia);
        return [resultado, null];
    } catch (error) {
        console.error("Error en createAsistenciaService:", error);
        if (error.code === '23505') { // Error de clave duplicada
            return [null, "Ya existe una asistencia registrada para este estudiante en esta instancia"];
        }
        return [null, "Error al crear asistencia: " + error.message];
    }
}

// Read all
export async function getAsistenciasService(filtro = {}) {
    try {
        const repo = AppDataSource.getRepository(Asistencia);
        const where = {};
        if (filtro.correo) where.correo = filtro.correo;
        if (filtro.idInstancia) where.idInstancia = filtro.idInstancia;
        const asistencias = await repo.find({ where });
        return [asistencias, null];
    } catch (error) {
        return [null, "Error al obtener asistencias: " + error.message];
    }
}

// Read one
export async function getAsistenciaService(query) {
    try {
        const repo = AppDataSource.getRepository(Asistencia);
        const asistencia = await repo.findOne({ where: query });
        if (!asistencia) return [null, "Asistencia no encontrada"];
        return [asistencia, null];
    } catch (error) {
        return [null, "Error al buscar asistencia: " + error.message];
    }
}

// Update
export async function updateAsistenciaService(query, data) {
    try {
        const repo = AppDataSource.getRepository(Asistencia);
        const asistencia = await repo.findOne({ where: query });
        if (!asistencia) return [null, "Asistencia no encontrada"];
        Object.assign(asistencia, data);
        await repo.save(asistencia);
        return [asistencia, null];
    } catch (error) {
        return [null, "Error al actualizar asistencia: " + error.message];
    }
}

// Delete
export async function deleteAsistenciaService(query) {
    try {
        const repo = AppDataSource.getRepository(Asistencia);
        const asistencia = await repo.findOne({ where: query });
        if (!asistencia) return [null, "Asistencia no encontrada"];
        await repo.remove(asistencia);
        return [asistencia, null];
    } catch (error) {
        return [null, "Error al eliminar asistencia: " + error.message];
    }
}
