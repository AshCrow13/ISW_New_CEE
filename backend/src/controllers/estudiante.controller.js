"use strict";
import {
    createEstudianteService, 
    deleteEstudianteService,
    getEstudianteService,
    getEstudiantesService,
    updateEstudianteService,
} from "../services/estudiante.service.js";
import { 
    estudianteQuerySchema, 
    estudianteSchema,
    estudianteUpdateSchema  
} from "../validations/estudiante.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

// CREATE
export async function createEstudiante(req, res) {
    try {
        const { body } = req;
        const { error } = estudianteSchema.validate(body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [estudiante, serviceError] = await createEstudianteService(body);
        if (serviceError) return handleErrorClient(res, 400, serviceError);

        handleSuccess(res, 201, "Estudiante creado correctamente", estudiante);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ (Todos)
export async function getEstudiantes(req, res) {
    try {
        const [estudiantes, errorEstudiantes] = await getEstudiantesService();
        if (errorEstudiantes) return handleErrorClient(res, 404, errorEstudiantes);
        handleSuccess(res, 200, "Estudiantes encontrados", estudiantes);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ (Uno)
export async function getEstudiante(req, res) {
    try {
        const { query } = req;
        const { error } = estudianteQuerySchema.validate(query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [estudiante, serviceError] = await getEstudianteService(query);
        if (serviceError) return handleErrorClient(res, 404, serviceError);

        handleSuccess(res, 200, "Estudiante encontrado", estudiante);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// UPDATE
export async function updateEstudiante(req, res) {
    try {
        const { query, body } = req;
        const { error: queryError } = estudianteQuerySchema.validate(query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        const { error: bodyError } = estudianteUpdateSchema.validate(body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        // ✅ PASAR: Usuario que realiza la acción
        const [estudiante, serviceError] = await updateEstudianteService(query, body, req.user);
        if (serviceError) return handleErrorClient(res, 400, serviceError);

        handleSuccess(res, 200, "Estudiante actualizado correctamente", estudiante);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DELETE
export async function deleteEstudiante(req, res) {
    try {
        const { query } = req;
        const { error } = estudianteQuerySchema.validate(query);
        if (error) return handleErrorClient(res, 400, "Error en la consulta", error.message);

        const [estudiante, serviceError] = await deleteEstudianteService(query);
        if (serviceError) return handleErrorClient(res, 404, serviceError);

        handleSuccess(res, 200, "Estudiante eliminado correctamente", estudiante);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
