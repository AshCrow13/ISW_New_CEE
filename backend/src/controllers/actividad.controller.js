"use strict";
import {
    createActividadService, 
    deleteActividadService, 
    getActividadesService,
    getActividadService,
    updateActividadService,    
} from "../services/actividad.service.js";
import { 
    actividadQuerySchema,
    actividadSchema,
    actividadUpdateSchema,    
} from "../validations/actividad.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDb.js";
import Estudiante from "../entity/estudiante.entity.js";
import { enviarCorreoEstudiantes } from "../helpers/email.helper.js";

// CREATE
export async function createActividad(req, res) {
    try {
        // Validar que el cuerpo de la solicitud cumpla con el esquema
        const { error } = actividadSchema.validate(req.body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);
        
        // Validar que el usuario tenga el rol adecuado        
        const [actividad, err] = await createActividadService(req.body, req.user); 
        if (err) return handleErrorClient(res, 400, err);
        
        // Buscar los emails de todos los estudiantes
        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        const emails = estudiantes.map(e => e.email);

        // Enviar el correo
        await enviarCorreoEstudiantes(
            `Nueva actividad publicada: ${actividad.titulo}`,
            `<p>Se ha publicado una nueva actividad: <b>${actividad.titulo}</b><br>
            Fecha: ${actividad.fecha}<br>
            Lugar: ${actividad.lugar}<br>
            ¡No te la pierdas!</p>`,
            emails
        );

        handleSuccess(res, 201, "Actividad creada correctamente y notificación enviada", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ (Todos - con filtro)
export async function getActividades(req, res) {
    try {
        const [actividades, err] = await getActividadesService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        handleSuccess(res, 200, "Actividades encontradas", actividades);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ (Uno)
export async function getActividad(req, res) {
    try {
        const { error } = actividadQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [actividad, err] = await getActividadService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        handleSuccess(res, 200, "Actividad encontrada", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// UPDATE
export async function updateActividad(req, res) {
    try {
        // Validar que la consulta y el cuerpo de la solicitud cumplan con los esquemas
        const { error: queryError } = actividadQuerySchema.validate(req.query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        // Validar que el cuerpo de la solicitud cumpla con el esquema de actualización
        const { error: bodyError } = actividadUpdateSchema.validate(req.body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        // Llamar al servicio para actualizar la actividad
        const [actividad, err] = await updateActividadService(req.query, req.body, req.user);
        if (err) return handleErrorClient(res, 400, err);
        
        // Buscar los emails de todos los estudiantes
        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        const emails = estudiantes.map(e => e.email);

        // Enviar el correo
        await enviarCorreoEstudiantes(
            `Actividad actualizada: ${actividad.titulo}`,
            `<p>La actividad <b>${actividad.titulo}</b> ha sido actualizada.<br>
            Fecha: ${actividad.fecha}<br>
            Lugar: ${actividad.lugar}</p>`,
            emails
        );

        handleSuccess(res, 201, "Actividad creada correctamente y notificación enviada", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DELETE
export async function deleteActividad(req, res) {
    try {
        // Validar que la consulta cumpla con el esquema
        const { error } = actividadQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error en la consulta", error.message);
        
        // Llamar al servicio para eliminar la actividad
        const [actividad, err] = await deleteActividadService(req.query, req.user);
        if (err) return handleErrorClient(res, 404, err);

        handleSuccess(res, 200, "Actividad eliminada correctamente", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

