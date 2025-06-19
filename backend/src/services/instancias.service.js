"use strict";
import Instancia from "../entity/instancias.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Create
export async function createInstanciaService(data) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const claveAleatoria = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const instancia = repo.create({
            ...data,
            ClaveAsistencia: claveAleatoria,
            AsistenciaAbierta: false,
        });
        await repo.save(instancia);
        return [instancia, null];
    }catch (error) {
        return [null,"Error al crear Instancia" + error.message];
    }
}

// Read all 
export async function getInstanciasService(filtro = {}) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const where = {};
        if (filtro.id) where.id = filtro.id;
        if (filtro.Fecha) where.Fecha = filtro.Fecha; 
        const instancias = await repo.find({ where, order: { Fecha: "ASC" } });
        return [instancias, null];
    } catch (error) {
        return [null, "Error al obtener Instancias: " + error.message];
    }
}

// Read one
export async function getInstanciaService(query) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const instancia = await repo.findOne({ where: query });
        if (!instancia) return [null, "Instancia no encontrada"];
        return [instancia, null];
    } catch (error) {
        return [null, "Error al buscar instancia: " + error.message];
    }
}

// Update
export async function updateInstanciaService(query, data) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const instancia = await repo.findOne({ where: query });
        if (!instancia) return [null, "Instancia no encontrada"];
        Object.assign(instancia, data, { updatedAt: new Date() });
        await repo.save(instancia);
        return [instancia, null];
    } catch (error) {
        return [null, "Error al actualizar instancia: " + error.message];
    }
}

// Delete
export async function deleteInstanciaService(query) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const instancia = await repo.findOneBy({id:query});
        if (!instancia) return [null, "instancia no encontrada"];
        await repo.remove(instancia);
        return [instancia, null];
    } catch (error) {
        return [null, "Error al eliminar instancia: " + error.message];
    }
}