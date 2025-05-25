"use strict";
import {
    createDocumentoService, 
    deleteDocumentoService, 
    getDocumentoService,
    getDocumentosService,  
    updateDocumentoService,
} from "../services/documento.service.js";
import {
    documentoQuerySchema,
    documentoSchema,
    documentoUpdateSchema,    
} from "../validations/documento.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

// CREATE
export async function createDocumento(req, res) {
    try {
        const { error } = documentoSchema.validate(req.body);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [documento, err] = await createDocumentoService(req.body);
        if (err) return handleErrorClient(res, 400, err);

        handleSuccess(res, 201, "Documento creado correctamente", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ ALL
export async function getDocumentos(req, res) {
    try {
        const [documentos, err] = await getDocumentosService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        handleSuccess(res, 200, "Documentos encontrados", documentos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
    }

// READ ONE
export async function getDocumento(req, res) {
    try {
        const { error } = documentoQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [documento, err] = await getDocumentoService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        handleSuccess(res, 200, "Documento encontrado", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// UPDATE
export async function updateDocumento(req, res) {
    try {
        const { error: queryError } = documentoQuerySchema.validate(req.query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        const { error: bodyError } = documentoUpdateSchema.validate(req.body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        const [documento, err] = await updateDocumentoService(req.query, req.body);
        if (err) return handleErrorClient(res, 400, err);

        handleSuccess(res, 200, "Documento actualizado correctamente", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DELETE
export async function deleteDocumento(req, res) {
    try {
        const { error } = documentoQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error en la consulta", error.message);

        const [documento, err] = await deleteDocumentoService(req.query);
        if (err) return handleErrorClient(res, 404, err);

        handleSuccess(res, 200, "Documento eliminado correctamente", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
