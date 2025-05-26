"use strict"
import { 
    postVotacion as postVotacionService,
    deleteVotacion as deleteVotacionService,
    getVotacion as getVotacionService,
    getVotaciones as getVotacionesService,
    updateVotacion as updateVotacionService,
    } from "../services/votacion.service.js";
import {
    votacionBodyValidation,
    votacionQueryValidation,
    votacionUpdateBodyValidation
} from "../validations/votacion.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function postVotacion(req, res) {
    try {
        if (!req.user) {
          return handleErrorClient(res, 401, "Debes estar autenticado para crear una votación");
        }
        if (req.user.rol !== "administrador") {
          return handleErrorClient(res, 403, "No tienes permisos para crear una votación");
        }
        //Nos aseguramos que solo creen estudiantes de "Ingeniería en Computación e Informática"
        if (req.user.carrera !== "Ingeniería en Computación e Informática") {
            return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden crear votaciones");
        }
        const { body } = req;
    
        const { error } = votacionBodyValidation.validate(body);
    
        if (error) return handleErrorClient(res, 400, error.message);
    
        const [votacion, errorVotacion] = await postVotacionService(body);
    
        if (errorVotacion) return handleErrorClient(res, 400, errorVotacion);
    
        handleSuccess(res, 201, "Votación creada", votacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
    }

export async function deleteVotacion(req, res) {
    try {
        //Verificamos que lo elimine solamente un admin
        if (!req.user || req.user.rol !== "administrador") {
        return handleErrorClient(res, 403, "No tienes permisos para eliminar una votación");
        }
        //Verificamos que solo elimine estudiantes de "Ingeniería en Computación e Informática"
        if (req.user.carrera !== "Ingeniería en Computación e Informática") {
        return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden eliminar votaciones");
        }
        const { id } = req.params;
        const { error } = votacionQueryValidation.validate({ id });

        if (error) return handleErrorClient(res, 400, error.message);
    
        const [votacion, errorVotacion] = await deleteVotacionService(id);
    
        if (errorVotacion) return handleErrorClient(res, 404, errorVotacion);
    
        handleSuccess(res, 200, "Votación eliminada", votacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
    }

export async function getVotacion(req, res) {
  try {
    //Utiliza query(URL) para buscar por id o nombre
    if (req.user.carrera !== "Ingeniería en Computación e Informática") {
      return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden buscar votaciones");
    }

    const id = req.params.id;
    const { error } = votacionQueryValidation.validate({ id }); // <-- validación correcta

    if (error) return handleErrorClient(res, 400, error.message);


    const [votacion, errorVotacion] = await getVotacionService({ id});

    if (errorVotacion) return handleErrorClient(res, 404, errorVotacion);

    handleSuccess(res, 200, "Votación encontrada", votacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getVotaciones(req, res) {
  try {
    if (req.user.carrera !== "Ingeniería en Computación e Informática") {
      return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden buscar votaciones");
    }

    const [votaciones, errorVotaciones] = await getVotacionesService();


    if (errorVotaciones) return handleErrorClient(res, 404, errorVotaciones);

    votaciones.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Votaciones encontradas", votaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateVotacion(req, res) {
  try {
    //Solo lo puede modificar un admin
    if (!req.user || req.user.rol !== "administrador") {
      return handleErrorClient(res, 403, "No tienes permisos para modificar una votación");
    }
    if (req.user.carrera !== "Ingeniería en Computación e Informática") {
      return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden modificar votaciones");
    }

    const { id } = req.params;
    const { body } = req;

    const { error } = votacionUpdateBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, error.message);

    const [votacion, errorVotacion] = await updateVotacionService(id, body);

    if (errorVotacion) return handleErrorClient(res, 404, errorVotacion);

    handleSuccess(res, 200, "Votación actualizada", votacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}