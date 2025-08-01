"use strict";
import { NotificarAsamblea } from "../helpers/email.helper.js";
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
        console.log("Iniciando creación de instancia...");
        const { error } = instanciaSchema.validate(req.body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [instancia, err] = await createInstanciaService(req.body);
        if (err) return handleErrorClient(res, 400, err);

        console.log("Instancia creada exitosamente, obteniendo lista de estudiantes...");
        
        // Notificar antes de responder al cliente
        try {
            const [listaEmails, err] = await getEstudiantesService();
            if (err) {
                console.error("Error al obtener estudiantes:", err);
            } else {
                console.log(`Encontrados ${listaEmails.length} estudiantes para notificar`);
                
                let emailsEnviados = 0;
                for (const estudiante of listaEmails) {
                    if (estudiante && estudiante.email) {
                        try {
                            console.log(`Enviando correo a: ${estudiante.email}`);
                            await NotificarAsamblea(estudiante.email, req.body);
                            emailsEnviados++;
                        } catch (emailError) {
                            console.error(`Error al enviar correo a ${estudiante.email}:`, emailError);
                            // Continuar con el siguiente email
                        }
                    }
                }
                console.log(`Se enviaron ${emailsEnviados} correos exitosamente`);
            }
        } catch (notificationError) {
            console.error("Error en el proceso de notificación:", notificationError);
            // No fallar la creación de la instancia por errores de email
        }
        
        handleSuccess(res, 201, "Instancia creada correctamente", instancia);
        return;

    } catch (error) {
        console.error("Error general en createInstancia:", error);
        return handleErrorServer(res, 500, error.message);
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
        console.log("Query recibida:", req.query);
        console.log("Body recibido:", req.body);
        
        const { error: queryError } = instanciaQuerySchema.validate(req.query);
        if (queryError) {
            console.log("Error en query:", queryError.message);
            return handleErrorClient(res, 400, "Error en la consulta", queryError.message);
        }

        const { error: bodyError } = instanciaUpdateSchema.validate(req.body);
        if (bodyError) {
            console.log("Error en body:", bodyError.message);
            return handleErrorClient(res, 400, "Error en los datos", bodyError.message);
        }

        const [instancia, err] = await updateInstanciaService(req.query, req.body);
        if (err) return handleErrorClient(res, 400, err);

        handleSuccess(res, 200, "Instancia actualizada correctamente", instancia);
    } catch (error) {
        console.log("Error general:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}

// Delete
export async function deleteInstancia(req, res) {
    try {
        // const idInstancia = req.body.id;
        // if (!idInstancia){
        //     return handleErrorClient(res, 404, idInstancia);
        // }
        // const [instancia, err] = await deleteInstanciaService(idInstancia);
        const { error } = instanciaQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [instancia, err] = await deleteInstanciaService(req.query.id);
        if (err) return handleErrorClient(res, 404, err);

        handleSuccess(res, 200, "Instancia eliminada correctamente", instancia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}