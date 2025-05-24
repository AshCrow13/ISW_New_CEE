"use strict";
import {
    createActividadService,
    getActividadesService,
    getActividadByIdService,
    updateActividadService,
    deleteActividadService,
} from "../services/actividad.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createActividad(req, res) {
    try {
        const { body } = req;
        const [actividad, error] = await createActividadService(body, req.user);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 201, "Actividad creada exitosamente", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getActividades(req, res) {
    try {
        const [actividades, error] = await getActividadesService();
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "Actividades encontradas", actividades);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getActividadById(req, res) {
    try {
        const { id } = req.params;
        const [actividad, error] = await getActividadByIdService(id);
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "Actividad encontrada", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateActividad(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const [actividad, error] = await updateActividadService(id, body);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 200, "Actividad actualizada", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteActividad(req, res) {
    try {
        const { id } = req.params;
        const [actividad, error] = await deleteActividadService(id);
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "Actividad eliminada", actividad);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
