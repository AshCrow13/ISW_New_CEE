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
import path from "path";
import fs from "fs";
import { AppDataSource } from "../config/configDb.js";
import Documento from "../entity/documento.entity.js";

// CREATE - Subida de archivo
export async function createDocumento(req, res) {
    try {
        if (!req.file) {
            return handleErrorClient(res, 400, "Debe adjuntar un archivo válido.");
        }

        const documentoData = { // Extraemos los datos del archivo y los campos adicionales
            ...req.body,
            urlArchivo: `/api/documentos/download/${req.file.filename}`,
            subidoPor: req.user.email
        };

        const { error } = documentoSchema.validate(documentoData);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [documento, err] = await createDocumentoService(documentoData, req.user);
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

// UPDATE - solo actualiza los datos de texto
export async function updateDocumento(req, res) {
    try {
        const { error: queryError } = documentoQuerySchema.validate(req.query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        const { error: bodyError } = documentoUpdateSchema.validate(req.body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        const [documento, err] = await updateDocumentoService(req.query, req.body, req.user);
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

        const [documento, err] = await deleteDocumentoService(req.query, req.user);
        if (err) return handleErrorClient(res, 404, err);

        // borrar el archivo físico del servidor
        if (documento && documento.urlArchivo) {
            const filename = documento.urlArchivo.split("/").pop();
            const filePath = path.join(process.cwd(), "uploads", filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        handleSuccess(res, 200, "Documento eliminado correctamente", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DOWNLOAD 
export async function downloadDocumento(req, res) {
    try {
        const { id } = req.params;
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: { id: parseInt(id) } });
        if (!documento) return handleErrorClient(res, 404, "Documento no encontrado");

        const url = documento.urlArchivo; // "/api/documentos/download/filename"
        const filename = url.split("/").pop();
        const filePath = path.join(process.cwd(), "uploads", filename);

        if (!fs.existsSync(filePath)) {
            return handleErrorClient(res, 404, "Archivo no encontrado en el servidor");
        }
        res.download(filePath, documento.titulo + path.extname(filename));
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

