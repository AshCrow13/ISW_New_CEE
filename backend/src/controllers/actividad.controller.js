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

// CREATE
export async function createActividad(req, res) {
    try {
        const { error } = actividadSchema.validate(req.body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [actividad, err] = await createActividadService(req.body);
        if (err) return handleErrorClient(res, 400, err);

        handleSuccess(res, 201, "Actividad creada correctamente", actividad);
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
        const { error: queryError } = actividadQuerySchema.validate(req.query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        const { error: bodyError } = actividadUpdateSchema.validate(req.body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        const [actividad, err] = await updateActividadService(req.query, req.body);
        if (err) return handleErrorClient(res, 400, err);

        handleSuccess(res, 200, "Actividad actualizada correctamente", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DELETE
export async function deleteActividad(req, res) {
    try {
        const { error } = actividadQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error en la consulta", error.message);

        const [actividad, err] = await deleteActividadService(req.query);
        if (err) return handleErrorClient(res, 404, err);

        handleSuccess(res, 200, "Actividad eliminada correctamente", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

