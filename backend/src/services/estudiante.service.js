"use strict";
import bcrypt from "bcryptjs";
import Estudiante from "../entity/estudiante.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Historial from "../entity/historial.entity.js"; // ✅ IMPORTAR: Entidad Historial

// CREATE
export async function createEstudianteService(data) {
    try {
        const repo = AppDataSource.getRepository(Estudiante);

        const existingRut = await repo.findOne({ where: { rut: data.rut } });
        if (existingRut) return [null, "Ya existe un estudiante con ese RUT."];

        const existingEmail = await repo.findOne({ where: { email: data.email } });
        if (existingEmail) return [null, "Ya existe un estudiante con ese email."];

        const hash = await bcrypt.hash(data.password, 10);
        const estudiante = repo.create({ ...data, password: hash });
        await repo.save(estudiante);

        const { password, ...estudianteSinPassword } = estudiante;
        return [estudianteSinPassword, null];
    } catch (error) {
        return [null, "Error al crear estudiante: " + error.message];
    }
}

// READ (Todos)
export async function getEstudiantesService() {
    try {
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiantes = await repo.find({ order: { createdAt: "DESC" } });
        const result = estudiantes.map(({ password, ...rest }) => rest);
        return [result, null]; // ✅ Formato correcto
    } catch (error) {
        return [null, "Error al obtener estudiantes: " + error.message];
    }
}

// READ (Uno)
export async function getEstudianteService(query) {
    try {
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query });
        if (!estudiante) return [null, "Estudiante no encontrado"];
        const { password, ...estudianteSinPassword } = estudiante;
        return [estudianteSinPassword, null];
    } catch (error) {
        return [null, "Error al buscar estudiante: " + error.message];
    }
}

// UPDATE
export async function updateEstudianteService(query, data, usuario) { // ✅ AGREGAR: parámetro usuario
    try {
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query });
        if (!estudiante) return [null, "Estudiante no encontrado"];

        let dataToUpdate = { ...data, updatedAt: new Date() };
        
        if (data.newPassword) {
            dataToUpdate.password = await bcrypt.hash(data.newPassword, 10);
            delete dataToUpdate.newPassword;
        }
        
        Object.assign(estudiante, dataToUpdate);
        await repo.save(estudiante);

        // ✅ MEJORAR: Usar el usuario real que hace la acción
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({
            usuario: usuario || { email: "sistema@cee.cl" }, // ✅ Usuario real o sistema
            accion: "editar",
            tipo: "estudiante", 
            referenciaId: estudiante.id,
            fecha: new Date()
        });

        const { password, ...estudianteSinPassword } = estudiante;
        return [estudianteSinPassword, null];
    } catch (error) {
        return [null, "Error al actualizar estudiante: " + error.message];
    }
}

// DELETE
export async function deleteEstudianteService(query) {
    try {
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query });
        if (!estudiante) return [null, "Estudiante no encontrado"];
        await repo.remove(estudiante);
        const { password, ...estudianteSinPassword } = estudiante;
        return [estudianteSinPassword, null];
    } catch (error) {
        return [null, "Error al eliminar estudiante: " + error.message];
    }
}
