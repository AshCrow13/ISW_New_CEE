"use strict"
import{
    postOpcion as postOpcionService,
    deleteOpcion as deleteOpcionService,
    getOpcion as getOpcionService,
    getOpciones as getOpcionesService,
    updateOpcion as updateOpcionService
} from "../services/opciones.service.js";
import {
    opcionesBodyValidation,
    opcionesQueryValidation,
    opcionesVotacionIdValidation
} from "../validations/opciones.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

//Postear una opcion en una votacion especificaService
export async function postOpcion(req, res) {
    try {
        //Verificamos que lo cree solamente un admin
        if (!req.user || req.user.rol !== "administrador") {
            return handleErrorClient(res, 403, "No tienes permisos para crear una opción");
        }
        if (req.user.carrera !== "Ingeniería en Computación e Informática") {
            return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden crear opciones");
        }
        //Verificamos que la votacion exista
        const { votacionId } = req.params;
        const { body } = req;
    
        //
        body.votacion = {id: Number(votacionId)};

        const { error } = opcionesBodyValidation.validate(body);
        if (error) return handleErrorClient(res, 400, error.message);
    
        const [opcion, errorOpcion] = await postOpcionService(body);
    
        if (errorOpcion) return handleErrorClient(res, 400, errorOpcion);
    
        handleSuccess(res, 201, "Opción creada", opcion)
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
//Eliminar una opcion en una votacion especifica
export async function deleteOpcion(req, res) {
    try {
        //Verificamos que lo elimine solamente un admin 
        if (!req.user || req.user.rol !== "administrador") {
            return handleErrorClient(res, 403, "No tienes permisos para eliminar una opción");
        }
        if (req.user.carrera !== "Ingeniería en Computación e Informática") {
            return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden eliminar opciones");
        }
        const { votacionId, id } = req.params;
        const { error } = opcionesQueryValidation.validate({ id });
        if(error) return handleErrorClient(res, 400, error.message);
    
        const [opcion, errorOpcion] = await deleteOpcionService(Number(id), Number(votacionId));
    
        if (errorOpcion) return handleErrorClient(res, 404, errorOpcion);
    
        handleSuccess(res, 200, "Opción eliminada", opcion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

//Obtener una opcion en una votacion especifica
export async function getOpcion(req, res) {
    try {
        if(req.user.carrera !== "Ingeniería en Computación e Informática") {
            return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden ver las opciones");
        }
        const { votacionId, id } = req.params;
        console.log("VotacionId", votacionId , "Id", id);
        const { error } = opcionesQueryValidation.validate({ id: Number(id) });
        if (error) return handleErrorClient(res, 400, error.message);
    
        const [opcion, errorOpcion] = await getOpcionService(Number(id), Number(votacionId));
    
        if (errorOpcion) return handleErrorClient(res, 404, errorOpcion);
    
        handleSuccess(res, 200, "Opción encontrada", opcion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
//Obtener todas las opciones de una votacion especifica
export async function getOpciones(req, res) {
    try {
        if(req.user.carrera !== "Ingeniería en Computación e Informática") {
            return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden ver las opciones");
        }
        const { votacionId } = req.params;
        console.log("VotacionId", votacionId);
        const { error } = opcionesVotacionIdValidation.validate({ votacionId });
        if (error) return handleErrorClient(res, 400, error.message);


        const [opciones, errorOpciones] = await getOpcionesService(Number(votacionId));
    
        if (errorOpciones) return handleErrorClient(res, 404, errorOpciones);
    
        handleSuccess(res, 200, "Opciones encontradas", opciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

//Actualizar una opcion en una votacion especifica
export async function updateOpcion(req, res) {
    try {
        if(req.user.carrera !== "Ingeniería en Computación e Informática") {
            return handleErrorClient(res, 403, "Solo estudiantes de Ingeniería en Computación e Informática pueden actualizar opciones");
        }
        //Verificamos que lo elimine solamente un admin
        if (!req.user || req.user.rol !== "administrador") {
            return handleErrorClient(res, 403, "No tienes permisos para actualizar una opción");
        }
        const { errorq } = opcionesQueryValidation.validate(req.params);
        if (errorq) return handleErrorClient(res, 400, error.message);

        const { votacionId, id } = req.params;
        const { body } = req;
    
        const { error } = opcionesBodyValidation.validate(body);
    
        if (error) return handleErrorClient(res, 400, error.message);
    
        const [opcion, errorOpcion] = await updateOpcionService(Number(votacionId), Number(id), body);
    
        if (errorOpcion) return handleErrorClient(res, 404, errorOpcion);
    
        handleSuccess(res, 200, "Opción actualizada", opcion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

