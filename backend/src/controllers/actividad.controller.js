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
import { createDocumentoService } from "../services/documento.service.js";
import path from "path";

// CREATE - Crear una nueva actividad
export async function createActividad(req, res) {
    try {
        // Validar datos de entrada (esquema y fecha)
        const { error } = actividadSchema.validate(req.body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        // Validar que la fecha sea válida y futura
        const fechaActividad = new Date(req.body.fecha);
        const ahora = new Date();
        if (isNaN(fechaActividad.getTime())) {
            return handleErrorClient(res, 400, "La fecha de la actividad no es válida.");
        }
        if (fechaActividad < ahora) {
            return handleErrorClient(res, 400, "La fecha de la actividad debe ser posterior a la fecha actual.");
        }

        // Crear la actividad en la base de datos
        const [actividad, err] = await createActividadService(req.body, req.user); 
        if (err) return handleErrorClient(res, 400, err);

        // Si hay archivo adjunto, crear el documento y asociarlo a la actividad
        let archivoAdjunto = null;
        if (req.file) {
            const docData = {
                titulo: req.body.titulo || "Documento de actividad",
                tipo: "Actividad",
                urlArchivo: `/api/documentos/download/${req.file.filename}`,
                subidoPor: req.user.email,
                id_actividad: actividad.id,
            };
            await createDocumentoService(docData, req.user);

            // Preparar adjunto para el correo
            archivoAdjunto = {
                filename: req.file.originalname,
                path: path.join(process.cwd(), "uploads", req.file.filename)
            };
        }

        // Notificar a todos los estudiantes por correo electrónico
        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        const emails = estudiantes.map(e => e.email);

        await enviarCorreoEstudiantes(
            `Nueva actividad publicada: ${actividad.titulo}`,
            `
            <p>¡Hola estudiante!</p>
            <p>Te informamos que se ha publicado una nueva actividad organizada por el Centro de Estudiantes:</p>
            <ul>
                <li><b>${actividad.titulo}</b></li>
                <li><b>Fecha:</b> ${actividad.fecha}</li>
                <li><b>Lugar:</b> ${actividad.lugar}</li>
                <li><b>Descripción:</b> ${actividad.descripcion}</li>
            </ul>
            <p>¡No te la pierdas!</p>
            `,
            emails,
            archivoAdjunto ? [archivoAdjunto] : undefined
        );

        // Responder al cliente con éxito
        handleSuccess(res, 201, "Actividad creada correctamente y notificación enviada", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ - Obtener todas las actividades (con filtro opcional)
export async function getActividades(req, res) {
    try {
        // Validar parámetros de consulta (si aplica)
        const [actividades, err] = await getActividadesService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        // Responder con la lista de actividades
        handleSuccess(res, 200, "Actividades encontradas", actividades);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ - Obtener una actividad específica
export async function getActividad(req, res) {
    try {
        // Validar parámetros de consulta
        const { error } = actividadQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        // Buscar la actividad por ID o filtro
        const [actividad, err] = await getActividadService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        // Responder con la actividad encontrada
        handleSuccess(res, 200, "Actividad encontrada", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// UPDATE - Actualizar una actividad existente
export async function updateActividad(req, res) {
    try {
        // Validar parámetros de consulta y cuerpo de la solicitud
        const { error: queryError } = actividadQuerySchema.validate(req.query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        const { error: bodyError } = actividadUpdateSchema.validate(req.body);
        if (bodyError) {
            return handleErrorClient(res, 400, "Error en los datos", bodyError.details[0].message);
        }

        // Validar responsableId si se proporciona
        if (req.body.responsableId) {
            const responsableId = parseInt(req.body.responsableId);
            if (isNaN(responsableId) || responsableId <= 0) {
                return handleErrorClient(res, 400, 
                    "ID de responsable inválido", "El ID del responsable debe ser un número positivo");
            }
        }

        // Actualizar la actividad en la base de datos
        const [actividad, err] = await updateActividadService(req.query, req.body, req.user);
        if (err) return handleErrorClient(res, 400, err);

        // Notificar a todos los estudiantes por correo electrónico
        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        const emails = estudiantes.map(e => e.email);

        await enviarCorreoEstudiantes(
            `Actividad actualizada: ${actividad.titulo}`,
            `<p>La actividad <b>${actividad.titulo}</b> ha sido actualizada.<br>
            Fecha: ${actividad.fecha}<br>
            Lugar: ${actividad.lugar}</p>`,
            emails
        );

        // Responder al cliente con éxito
        handleSuccess(res, 200, "Actividad actualizada correctamente", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DELETE - Eliminar una actividad
export async function deleteActividad(req, res) {
    try {
        // Validar parámetros de consulta
        const { error } = actividadQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error en la consulta", error.message);

        // Eliminar la actividad de la base de datos
        const [actividad, err] = await deleteActividadService(req.query, req.user);
        if (err) return handleErrorClient(res, 404, err);

        // Responder al cliente con éxito
        handleSuccess(res, 200, "Actividad eliminada correctamente", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

