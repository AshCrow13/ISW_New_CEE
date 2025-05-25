"use strict";
import Estudiante from "../entity/estudiante.entity.js";
import { AppDataSource } from "../config/configDb.js";
//import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function createEstudianteService(data) {
    try {
        const repo = AppDataSource.getRepository(Estudiante);

        // Verifica duplicados por RUT y email
        const existingRut = await repo.findOne({ where: { rut: data.rut } });
        if (existingRut) return [null, "Ya existe un estudiante con ese RUT."];

        const existingEmail = await repo.findOne({ where: { email: data.email } });
        if (existingEmail) return [null, "Ya existe un estudiante con ese email."];

        const estudiante = repo.create(data);
        await repo.save(estudiante);
        return [estudiante, null];
    } catch (error) {
        return [null, "Error al crear estudiante: " + error.message];
    }
}

export async function getEstudiantesService() {
    try {
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiantes = await repo.find({ order: { createdAt: "DESC" } });
        return [estudiantes, null];
    } catch (error) {
        return [null, "Error al obtener estudiantes: " + error.message];
    }
}

export async function getEstudianteService(query) {
    try {
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query });
        if (!estudiante) return [null, "Estudiante no encontrado"];
        return [estudiante, null];
    } catch (error) {
        return [null, "Error al buscar estudiante: " + error.message];
    }
}

export async function updateEstudianteService(query, data) {
    try {
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query });
        if (!estudiante) return [null, "Estudiante no encontrado"];

        Object.assign(estudiante, data, { updatedAt: new Date() });
        await repo.save(estudiante);
        return [estudiante, null];
    } catch (error) {
        return [null, "Error al actualizar estudiante: " + error.message];
    }
}

export async function deleteEstudianteService(query) {
    try {
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query });
        if (!estudiante) return [null, "Estudiante no encontrado"];
        await repo.remove(estudiante);
        return [estudiante, null];
    } catch (error) {
        return [null, "Error al eliminar estudiante: " + error.message];
    }
}
