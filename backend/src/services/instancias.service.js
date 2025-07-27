"use strict";
import Instancia from "../entity/instancias.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Create
export async function createInstanciaService(data) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        
        // Generar clave alfanumérica de 6 caracteres
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let claveAleatoria = '';
        for (let i = 0; i < 6; i++) {
            claveAleatoria += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const instancia = repo.create({
            ...data,
            ClaveAsistencia: data.ClaveAsistencia || claveAleatoria,
            AsistenciaAbierta: data.AsistenciaAbierta || false,
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
export async function getInstanciaService(id) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        const instancia = await repo.findOneBy({id: id});
        if (!instancia) return [null, "Instancia no encontrada"];
        return [instancia, null];
    } catch (error) {
        return [null, "Error al buscar instancia: " + error.message];
    }
}

// Update
// export async function updateInstanciaService(query) {
export async function updateInstanciaService(query, data) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        // const instancia = await repo.findOneBy({id:query});
        // if (!instancia) return [null, "instancia no encontrada"]
        const instancia = await repo.findOneBy({id: query.id});
        if (!instancia) return [null, "Instancia no encontrada"];
        
        // Solo actualizar los campos que se proporcionan
        const camposActualizados = {};
        if (data.Temas !== undefined) camposActualizados.Temas = data.Temas;
        if (data.Fecha !== undefined) camposActualizados.Fecha = data.Fecha;
        if (data.Sala !== undefined) camposActualizados.Sala = data.Sala;
        if (data.AsistenciaAbierta !== undefined) camposActualizados.AsistenciaAbierta = data.AsistenciaAbierta;
        if (data.ClaveAsistencia !== undefined) camposActualizados.ClaveAsistencia = data.ClaveAsistencia;
        
        Object.assign(instancia, camposActualizados, { updatedAt: new Date() });
        await repo.save(instancia);
        return [instancia, null];
    } catch (error) {
        return [null, "Error al actualizar instancia: " + error.message];
    }
}

// Delete
// export async function deleteInstanciaService(query) {
export async function deleteInstanciaService(id) {
    try {
        const repo = AppDataSource.getRepository(Instancia);
        // const instancia = await repo.findOneBy({id:query});
        // if (!instancia) return [null, "instancia no encontrada"];
        const instancia = await repo.findOneBy({id: id});
        if (!instancia) return [null, "Instancia no encontrada"];
        await repo.remove(instancia);
        return [instancia, null];
    } catch (error) {
        return [null, "Error al eliminar instancia: " + error.message];
    }
}