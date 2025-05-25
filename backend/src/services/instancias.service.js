"use strict";
import Instancias from "../entity/instancias.entity.js";
import { AppDataSource } from "../config/configDb.js";


export async function createInstanciaService(data) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const instancia = repo.create(data);
        await repo.save(instancia);
        return [instancia, null];
    }catch (error) {
        return [null,"Error al crear Instancia" + error.message];
    }
}

// Get
export async function getInstanciasService(filtro = {}) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const where = {};
        if (filtro.categoria) where.categoria = filtro.categoria;
        if (filtro.fecha) where.fecha = filtro.fecha; 
        const instancias = await repo.find({ where, order: { fecha: "ASC" } });
        return [instancias, null];
    } catch (error) {
        return [null, "Error al obtener Instancias: " + error.message];
    }
}
// Get one
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
export async function deleteInstanciasService(query) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const instancia = await repo.findOne({ where: query });
        if (!instancia) return [null, "instancia no encontrada"];
        await repo.remove(instancia);
        return [instancia, null];
    } catch (error) {
        return [null, "Error al eliminar instancia: " + error.message];
    }
}