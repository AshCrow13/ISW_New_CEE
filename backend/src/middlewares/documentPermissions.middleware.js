"use strict";
import { AppDataSource } from "../config/configDb.js";
import Estudiante from "../entity/estudiante.entity.js";
import Documento from "../entity/documento.entity.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

/**
 * Middleware que verifica si un usuario puede crear un documento de cierto tipo
 */
export const canCreateDocumentType = (req, res, next) => {
  try {
    const userRole = req.user?.rol;
    const docType = req.body.tipo;

    // Verificar el rol y el tipo de documento
    if (userRole === 'admin') {
      // Admin puede crear cualquier tipo de documento
      return next();
    } else if (userRole === 'vocalia') {
      // Vocalia solo puede crear documentos de tipo "Actividad" u "Otros"
      if (docType === 'Actividad' || docType === 'Otros') {
        return next();
      } else {
        return handleErrorClient(
          res, 
          403, 
          "Permisos insuficientes", 
          "Vocalia solo puede crear documentos de tipo 'Actividad' u 'Otros'"
        );
      }
    } else {
      return handleErrorClient(
        res, 
        403, 
        "Permisos insuficientes", 
        "No tienes permisos para crear documentos"
      );
    }
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
};

/**
 * Middleware que verifica si un usuario puede modificar un documento específico
 */
export const canModifyDocument = async (req, res, next) => {
  try {
    const userRole = req.user?.rol;
    const documentId = req.query.id;

    if (!documentId) {
      return handleErrorClient(res, 400, "ID de documento no proporcionado");
    }

    // Admin puede modificar cualquier documento
    if (userRole === 'admin') {
      return next();
    }

    // Buscar el documento para verificar su tipo
    const repo = AppDataSource.getRepository(Documento);
    const documento = await repo.findOne({ where: { id: documentId } });
    
    if (!documento) {
      return handleErrorClient(res, 404, "Documento no encontrado");
    }

    // Vocalia solo puede modificar documentos de tipo "Actividad" u "Otros"
    if (userRole === 'vocalia' && (documento.tipo === 'Actividad' || documento.tipo === 'Otros')) {
      return next();
    }

    return handleErrorClient(
      res, 
      403, 
      "Permisos insuficientes", 
      "No tienes permisos para modificar este tipo de documento"
    );
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
};
