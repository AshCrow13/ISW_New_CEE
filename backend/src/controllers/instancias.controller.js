"use strict";
import {NotificarAsamblea} from "../middlewares/email.middleware.js";
import { getEstudiantesService} from "../services/estudiante.service.js";
import {
    createInstanciaService, 
    deleteInstanciaService, 
    getInstanciasService,
    getInstanciaService,
    updateInstanciaService,    
} from "../services/instancias.service.js";
import { 
    instanciaQuerySchema,
    instanciaSchema,
    instanciaUpdateSchema,    
} from "../validations/instancia.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";


// Create
export async function createInstancia(req, res) {

    try {
        const { error } = instanciaSchema.validate(req.body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [instancia, err] = await createInstanciaService(req.body);
        if (err) return handleErrorClient(res, 400, err);
        handleSuccess(res, 201, "Instancia creada correctamente", instancia);

        const listaEmails = await getEstudiantesService();

        for (const email in listaEmails){
            NotificarAsamblea(listaEmails[email].email,req.body);
        }   

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }

}

// Read all
export async function getInstancias(req, res) {
    try {
        const [instancias, err] = await getInstanciasService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        handleSuccess(res, 200, "Instancias encontradas", instancias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Read one
export async function getInstancia(req, res) {
    try {
        const { error } = instanciaQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [instancia, err] = await getInstanciaService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        handleSuccess(res, 200, "Instancia encontrada", instancia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Update
export async function updateInstancia(req, res) {
    try {
        const { error: queryError } = instanciaQuerySchema.validate(req.query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        const { error: bodyError } = instanciaUpdateSchema.validate(req.body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        const [instancia, err] = await updateInstanciaService(req.query, req.body);
        if (err) return handleErrorClient(res, 400, err);

        handleSuccess(res, 200, "Instancia actualizada correctamente", instancia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Delete
export async function deleteInstancia(req, res) {
    try {
        const idInstancia = req.body.id;
        if (!idInstancia){
            return handleErrorClient(res, 404, idInstancia);
        }
        const [instancia, err] = await deleteInstanciaService(idInstancia);
        if (err) return handleErrorClient(res, 404, err);

        handleSuccess(res, 200, "Instancia eliminada correctamente", instancia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}