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
import sharp from "sharp"; // Agregar sharp para optimizar imágenes

// CREATE - Subida de archivo y registro de documento
export async function createDocumento(req, res) {
    try {
        // Verificar que el archivo fue adjuntado correctamente
        if (!req.file) {
            return handleErrorClient(res, 400, "Debe adjuntar un archivo válido.");
        }

        // Si es imagen, optimizar antes de guardar
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const isImage = [".jpg", ".jpeg", ".png", ".webp"].includes(fileExt);
        if (isImage) {
            try {
                // Optimización de imagen (resize y compresión)
                const originalPath = req.file.path;
                const optimizedPath = `${originalPath.substring(0, originalPath.lastIndexOf("."))}_opt${fileExt}`;
                await sharp(originalPath)
                    .resize(1200)
                    .jpeg({ quality: 80 })
                    .toFile(optimizedPath);
                fs.unlinkSync(originalPath);
                fs.renameSync(optimizedPath, originalPath);
            } catch (optimizationError) {
                console.error("Error al optimizar imagen:", optimizationError);
                // Si falla la optimización, continuar con el archivo original
            }
        }

        // Preparar datos del documento para guardar en la base de datos
        const documentoData = {
            titulo: req.body.titulo,
            tipo: req.body.tipo,
            urlArchivo: `/api/documentos/download/${req.file.filename}`, // URL generada
            subidoPor: req.user.email,
            id_actividad: req.body.id_actividad || null // ID de actividad opcional
        };

        // Validar datos del documento
        const { error } = documentoSchema.validate(documentoData);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        // Guardar el documento en la base de datos
        const [documento, err] = await createDocumentoService(documentoData, req.user); 
        if (err) return handleErrorClient(res, 400, err);

        // Responder con éxito
        handleSuccess(res, 201, "Documento creado correctamente", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ ALL - Obtener todos los documentos (con filtro opcional)
export async function getDocumentos(req, res) {
    try {
        // Obtener documentos según filtros de consulta
        const [documentos, err] = await getDocumentosService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        // Responder con la lista de documentos
        handleSuccess(res, 200, "Documentos encontrados", documentos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// READ ONE - Obtener un documento específico
export async function getDocumento(req, res) {
    try {
        // Validar parámetros de consulta
        const { error } = documentoQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        // Buscar el documento por ID o filtro
        const [documento, err] = await getDocumentoService(req.query);
        if (err) return handleErrorClient(res, 404, err);
        // Responder con el documento encontrado
        handleSuccess(res, 200, "Documento encontrado", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// UPDATE - Actualizar los datos de un documento (solo texto, no archivo)
export async function updateDocumento(req, res) {
    try {
        // Validar parámetros de consulta y cuerpo de la solicitud
        const { error: queryError } = documentoQuerySchema.validate(req.query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        const { error: bodyError } = documentoUpdateSchema.validate(req.body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        // Validar permisos si se cambia el tipo de documento (solo vocalía)
        if (req.body.tipo && req.user.rol === "vocalia") {
            const repo = AppDataSource.getRepository(Documento);
            const documento = await repo.findOne({ where: { id: parseInt(req.query.id) } });
            if (documento && !(req.body.tipo === "Actividad" || req.body.tipo === "Otros")) {
                return handleErrorClient(
                    res, 
                    403, 
                    "Permisos insuficientes", 
                    "Vocalia solo puede cambiar el tipo a 'Actividad' u 'Otros'"
                );
            }
        }

        // Actualizar el documento en la base de datos
        const [documento, err] = await updateDocumentoService(req.query, req.body, req.user);
        if (err) return handleErrorClient(res, 400, err);

        // Responder con éxito
        handleSuccess(res, 200, "Documento actualizado correctamente", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DELETE - Eliminar un documento y su archivo físico
export async function deleteDocumento(req, res) {
    try {
        // Validar parámetros de consulta
        const { error } = documentoQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error en la consulta", error.message);

        // Eliminar el documento de la base de datos y registrar en historial
        const [documento, err] = await deleteDocumentoService(req.query, req.user);
        if (err) return handleErrorClient(res, 404, err);

        // Eliminar el archivo físico del servidor si existe
        if (documento && documento.urlArchivo) {
            const filename = documento.urlArchivo.split("/").pop();
            const filePath = path.join(process.cwd(), "uploads", filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Responder con éxito
        handleSuccess(res, 200, "Documento eliminado correctamente", documento);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// DOWNLOAD - Descargar el archivo físico de un documento
export async function downloadDocumento(req, res) {
    try {
        const { id } = req.params;
        
        // Verificar si el parámetro es un número (ID) o un nombre de archivo
        const isNumericId = !isNaN(parseInt(id)) && parseInt(id).toString() === id;
        
        if (isNumericId) {
            // Descargar por ID (método original)
            const repo = AppDataSource.getRepository(Documento);
            const documento = await repo.findOne({ where: { id: parseInt(id) } });
            if (!documento) return handleErrorClient(res, 404, "Documento no encontrado");

            // Validar que el documento tenga una URL de archivo
            const url = documento.urlArchivo; // "/api/documentos/download/filename"
            const filename = url.split("/").pop();
            const filePath = path.join(process.cwd(), "uploads", filename); // "uploads/filename"

            // Verificar si el archivo existe en el servidor
            if (!fs.existsSync(filePath)) {
                return handleErrorClient(res, 404, "Archivo no encontrado en el servidor");
            }

            // Sanitizar el título para usarlo como nombre de archivo
            let safeTitle = documento.titulo
                .toString()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9_\-]/g, "_")
                .replace(/_+/g, "_")
                .replace(/^_+|_+$/g, "")
                .substring(0, 40);
            if (!safeTitle) safeTitle = "documento";
            res.download(filePath, safeTitle + path.extname(filename));
        } else {
            // Descargar por nombre de archivo directo (para PDFs)
            const filename = id; // En este caso, 'id' es realmente el nombre del archivo
            const filePath = path.join(process.cwd(), "uploads", filename);

            // Verificar si el archivo existe en el servidor
            if (!fs.existsSync(filePath)) {
                return handleErrorClient(res, 404, "Archivo no encontrado en el servidor");
            }

            // Para archivos directos, usar el nombre original
            res.download(filePath, filename);
        }
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

