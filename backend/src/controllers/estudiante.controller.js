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

// CREATE - Crear un nuevo estudiante
export async function createEstudiante(req, res) {
    try {
        // Validar datos del cuerpo de la solicitud
        const { body } = req;
        const { error } = estudianteSchema.validate(body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        // Crear estudiante en la base de datos
        const [estudiante, serviceError] = await createEstudianteService(body); 
        if (serviceError) return handleErrorClient(res, 400, serviceError);

        // Responder con éxito
        handleSuccess(res, 201, "Estudiante creado correctamente", estudiante);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ - Obtener todos los estudiantes
export async function getEstudiantes(req, res) {
    try {
        // Obtener todos los estudiantes desde el servicio
        const [estudiantes, errorEstudiantes] = await getEstudiantesService();
        if (errorEstudiantes) return handleErrorClient(res, 404, errorEstudiantes);
        // Responder con la lista de estudiantes
        handleSuccess(res, 200, "Estudiantes encontrados", estudiantes);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ - Obtener un estudiante específico
export async function getEstudiante(req, res) {
    try {
        // Validar parámetros de consulta
        const { query } = req;
        const { error } = estudianteQuerySchema.validate(query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        // Buscar estudiante por ID o filtro
        const [estudiante, serviceError] = await getEstudianteService(query);
        if (serviceError) return handleErrorClient(res, 404, serviceError);

        // Responder con el estudiante encontrado
        handleSuccess(res, 200, "Estudiante encontrado", estudiante);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// UPDATE - Actualizar los datos de un estudiante
export async function updateEstudiante(req, res) {
    try {
        // Validar parámetros de consulta y cuerpo de la solicitud
        const { query, body } = req;
        const { error: queryError } = estudianteQuerySchema.validate(query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        const { error: bodyError } = estudianteUpdateSchema.validate(body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        // Actualizar estudiante en la base de datos
        const [estudiante, serviceError] = await updateEstudianteService(query, body, req.user);
        if (serviceError) return handleErrorClient(res, 400, serviceError);

        // Responder con éxito
        handleSuccess(res, 200, "Estudiante actualizado correctamente", estudiante);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DELETE - Eliminar un estudiante
export async function deleteEstudiante(req, res) {
    try {
        // Validar parámetros de consulta
        const { query } = req;
        const { error } = estudianteQuerySchema.validate(query);
        if (error) return handleErrorClient(res, 400, "Error en la consulta", error.message);

        // Eliminar estudiante de la base de datos
        const [estudiante, serviceError] = await deleteEstudianteService(query);
        if (serviceError) return handleErrorClient(res, 404, serviceError);

        // Responder con éxito
        handleSuccess(res, 200, "Estudiante eliminado correctamente", estudiante);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
