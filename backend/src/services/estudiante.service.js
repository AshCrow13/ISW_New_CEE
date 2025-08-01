"use strict";
import bcrypt from "bcryptjs";
import Estudiante from "../entity/estudiante.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Historial from "../entity/historial.entity.js"; 

// CREATE
export async function createEstudianteService(data) {
    try { // Validar que el cuerpo de la solicitud cumpla con el esquema
        const repo = AppDataSource.getRepository(Estudiante);

        // Validar que el RUT y email sean únicos
        const existingRut = await repo.findOne({ where: { rut: data.rut } });
        if (existingRut) return [null, "Ya existe un estudiante con ese RUT."];

        const existingEmail = await repo.findOne({ where: { email: data.email } });
        if (existingEmail) return [null, "Ya existe un estudiante con ese email."];

        // Validar que el rol sea estudiante
        const hash = await bcrypt.hash(data.password, 10);
        const estudiante = repo.create({ ...data, password: hash });
        await repo.save(estudiante);

        // Registrar en historial
        const { password, ...estudianteSinPassword } = estudiante;
        return [estudianteSinPassword, null];
    } catch (error) {
        return [null, "Error al crear estudiante: " + error.message];
    }
}

// READ (Todos)
export async function getEstudiantesService() {
    try {
        const repo = AppDataSource.getRepository(Estudiante); // Obtener todos los estudiantes
        const estudiantes = await repo.find({ order: { createdAt: "DESC" } });
        const result = estudiantes.map(({ password, ...rest }) => rest);
        return [result, null]; // Formato correcto
    } catch (error) {
        return [null, "Error al obtener estudiantes: " + error.message];
    }
}

// READ (Uno)
export async function getEstudianteService(query) {
    try { // Validar que la consulta cumpla con el esquema
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query });
        if (!estudiante) return [null, "Estudiante no encontrado"];
        const { password, ...estudianteSinPassword } = estudiante; // Excluir la contraseña del resultado
        return [estudianteSinPassword, null];
    } catch (error) {
        return [null, "Error al buscar estudiante: " + error.message];
    }
}

// UPDATE
export async function updateEstudianteService(query, data, usuario) {
    try { // Validar que la consulta cumpla con el esquema
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query }); // Buscar estudiante por ID
        if (!estudiante) return [null, "Estudiante no encontrado"];

        let dataToUpdate = { ...data, updatedAt: new Date() }; // Actualizar fecha de modificación
        
        if (data.newPassword) { // Si se proporciona una nueva contraseña, hashearla
            dataToUpdate.password = await bcrypt.hash(data.newPassword, 10);
            delete dataToUpdate.newPassword;
        }
        
        Object.assign(estudiante, dataToUpdate); // Actualizar los campos del estudiante
        await repo.save(estudiante);

        // Usar el usuario real que hace la acción
        const historialRepo = AppDataSource.getRepository(Historial);
        await historialRepo.save({ // Registrar en historial
            usuario: usuario || { email: "sistema@cee.cl" }, // Usuario real o sistema
            accion: "editar",
            tipo: "estudiante", 
            referenciaId: estudiante.id,
            fecha: new Date()
        });

        const { password, ...estudianteSinPassword } = estudiante; // Excluir la contraseña del resultado
        return [estudianteSinPassword, null];
    } catch (error) {
        return [null, "Error al actualizar estudiante: " + error.message];
    }
}

// DELETE
export async function deleteEstudianteService(query) {
    try { // Validar que la consulta cumpla con el esquema
        const repo = AppDataSource.getRepository(Estudiante);
        const estudiante = await repo.findOne({ where: query }); // Buscar estudiante por ID
        if (!estudiante) return [null, "Estudiante no encontrado"];
        await repo.remove(estudiante);
        const { password, ...estudianteSinPassword } = estudiante; // Excluir la contraseña del resultado
        return [estudianteSinPassword, null];
    } catch (error) {
        return [null, "Error al eliminar estudiante: " + error.message];
    }
}
