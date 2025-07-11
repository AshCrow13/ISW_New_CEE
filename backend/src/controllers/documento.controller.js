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

// CREATE - Subida de archivo
export async function createDocumento(req, res) {
    try {
        // ✅ PRIMERA VALIDACIÓN: Verificar que el archivo existe
        if (!req.file) {
            return handleErrorClient(res, 400, "Debe adjuntar un archivo válido.");
        }

        // Optimizar imagen si el archivo es una imagen
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt);
        
        if (isImage) {
            try {
                // Ruta del archivo original
                const originalPath = req.file.path;
                // Ruta para la imagen optimizada
                const optimizedPath = `${originalPath.substring(0, originalPath.lastIndexOf('.'))}_opt${fileExt}`;
                
                // Optimizar imagen usando sharp
                await sharp(originalPath)
                    .resize(1200) // Redimensionar para que el ancho máximo sea 1200px
                    .jpeg({ quality: 80 }) // Optimizar calidad
                    .toFile(optimizedPath);
                
                // Eliminar archivo original y reemplazar con la versión optimizada
                fs.unlinkSync(originalPath);
                fs.renameSync(optimizedPath, originalPath);
            } catch (optimizationError) {
                console.error("Error al optimizar imagen:", optimizationError);
                // Continuar con el archivo original si falla la optimización
            }
        }
        
        // ✅ CONSTRUIR los datos del documento con la URL generada
        const documentoData = {
            titulo: req.body.titulo,
            tipo: req.body.tipo,
            urlArchivo: `/api/documentos/download/${req.file.filename}`, // URL generada
            subidoPor: req.user.email,
            id_actividad: req.body.id_actividad || null
        };

        // ✅ SEGUNDA VALIDACIÓN: Ahora validar con todos los datos completos
        const { error } = documentoSchema.validate(documentoData);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);
        
        // ✅ CREAR el documento en la base de datos
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
        // Validar que la consulta cumpla con el esquema
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
        // Validar que la consulta cumpla con el esquema
        const { error } = documentoQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        // Llamar al servicio para obtener el documento
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
        // Validar que la consulta y el cuerpo de la solicitud cumplan con los esquemas
        const { error: queryError } = documentoQuerySchema.validate(req.query);
        if (queryError) return handleErrorClient(res, 400, "Error en la consulta", queryError.message);

        // Validar que el cuerpo de la solicitud cumpla con el esquema de actualización
        const { error: bodyError } = documentoUpdateSchema.validate(req.body);
        if (bodyError) return handleErrorClient(res, 400, "Error en los datos", bodyError.message);

        // Si se está intentando cambiar el tipo de documento, verificar permisos adicionales
        if (req.body.tipo && req.user.rol === 'vocalia') {
            const repo = AppDataSource.getRepository(Documento);
            const documento = await repo.findOne({ where: { id: parseInt(req.query.id) } });
            
            // Si el documento existe y está intentando cambiar el tipo a uno no permitido
            if (documento && !(req.body.tipo === 'Actividad' || req.body.tipo === 'Otros')) {
                return handleErrorClient(
                    res, 
                    403, 
                    "Permisos insuficientes", 
                    "Vocalia solo puede cambiar el tipo a 'Actividad' u 'Otros'"
                );
            }
        }

        // Verificar si se está intentando actualizar el archivo
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
        // Validar que la consulta cumpla con el esquema
        const { error } = documentoQuerySchema.validate(req.query);
        if (error) return handleErrorClient(res, 400, "Error en la consulta", error.message);

        // Llamar al servicio para eliminar el documento
        // y registrar en el historial
        const [documento, err] = await deleteDocumentoService(req.query, req.user);
        if (err) return handleErrorClient(res, 404, err);

        // borrar el archivo físico del servidor
        if (documento && documento.urlArchivo) {
            const filename = documento.urlArchivo.split("/").pop();
            const filePath = path.join(process.cwd(), "uploads", filename); // "uploads/filename.ext"
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
        // Validar que el ID del documento sea un número válido
        const { id } = req.params;
        const repo = AppDataSource.getRepository(Documento);
        const documento = await repo.findOne({ where: { id: parseInt(id) } });
        if (!documento) return handleErrorClient(res, 404, "Documento no encontrado");

        // Validar que el documento tenga una URL de archivo
        const url = documento.urlArchivo; // "/api/documentos/download/filename"
        const filename = url.split("/").pop();
        const filePath = path.join(process.cwd(), "uploads", filename);

        // Verificar si el archivo existe en el servidor
        if (!fs.existsSync(filePath)) {
            return handleErrorClient(res, 404, "Archivo no encontrado en el servidor");
        }
        res.download(filePath, documento.titulo + path.extname(filename));
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

