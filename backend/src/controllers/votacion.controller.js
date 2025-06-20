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
        const { nombre, duracion, opciones, estado} = req.body;
        const { errorb } = votacionBodyValidation.validate({ nombre, duracion, opciones, estado });
        if (errorb) return handleErrorClient(res, 400, error.message);
        const inicio = new Date();
        const fin = new Date(inicio.getTime() + duracion * 60000); // 24 horas después
         
        const body = {
            nombre,
            inicio,
            duracion,
            fin,
            estado: true || req.body.estado, // Por defecto, la votación está abierta
            opciones // Incluimos cualquier otro campo adicional que pueda venir en el body
        };

        const [votacion, errorVotacion] = await postVotacionService(body);
    
        if (errorVotacion) return handleErrorClient(res, 400, errorVotacion);
    
        handleSuccess(res, 201, "Votación creada", votacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
    }

export async function deleteVotacion(req, res) {
    try {
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