"use strict"
import{
    postOpcion,
    deleteOpcion,
    getOpcion,
    getOpciones,
    updateOpcion
} from "../services/opciones.service.js";

export async function postOpcion(req, res) {
    try {
        //Verificamos que lo cree solamente un admin
        if (!req.user || req.user.rol !== "admin") {
            return handleErrorClient(res, 403, "No tienes permisos para crear una opción");
        }
        const { body } = req;
    
        const { error } = opcionesBodyValidation.validate(body);
    
        if (error) return handleErrorClient(res, 400, error.message);
    
        const [opcion, errorOpcion] = await postOpcion(body);
    
        if (errorOpcion) return handleErrorClient(res, 400, errorOpcion);
    
        handleSuccess(res, 201, "Opción creada", opcion)
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteOpcion(req, res) {
    try {
        //Verificamos que lo elimine solamente un admin
        if (!req.user || req.user.rol !== "admin") {
            return handleErrorClient(res, 403, "No tienes permisos para eliminar una opción");
        }
        const { id } = req.params;
    
        const [opcion, errorOpcion] = await deleteOpcion(id);
    
        if (errorOpcion) return handleErrorClient(res, 404, errorOpcion);
    
        handleSuccess(res, 200, "Opción eliminada", opcion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getOpcion(req, res) {
    try {
        const { id, texto } = req.query;
    
        const [opcion, errorOpcion] = await getOpcion({ id, texto });
    
        if (errorOpcion) return handleErrorClient(res, 404, errorOpcion);
    
        handleSuccess(res, 200, "Opción encontrada", opcion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getOpciones(req, res) {
    try {
        const [opciones, errorOpciones] = await getOpciones();
    
        if (errorOpciones) return handleErrorClient(res, 404, errorOpciones);
    
        handleSuccess(res, 200, "Opciones encontradas", opciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateOpcion(req, res) {
    try {
        //Verificamos que lo elimine solamente un admin
        if (!req.user || req.user.rol !== "admin") {
            return handleErrorClient(res, 403, "No tienes permisos para actualizar una opción");
        }
        const { id } = req.params;
        const { body } = req;
    
        const { error } = opcionesBodyValidation.validate(body);
    
        if (error) return handleErrorClient(res, 400, error.message);
    
        const [opcion, errorOpcion] = await updateOpcion(id, body);
    
        if (errorOpcion) return handleErrorClient(res, 404, errorOpcion);
    
        handleSuccess(res, 200, "Opción actualizada", opcion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

