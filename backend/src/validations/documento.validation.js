"use strict";
import Joi from "joi";

export const documentoSchema = Joi.object({
    titulo: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.empty": "El título no puede estar vacío.",
            "string.min": "El título debe tener al menos 5 caracteres.",
            "string.max": "El título debe tener máximo 100 caracteres.",
            "any.required": "El título es obligatorio."
    }),
    tipo: Joi.string()
        .valid("comunicado", "acta", "resultado")
        .required()
        .messages({
            "any.only": "El tipo debe ser comunicado, acta o resultado.",
            "any.required": "El tipo es obligatorio."
    }),
    urlArchivo: Joi.string()
        .uri()
        .required()
        .messages({
            "string.uri": "El campo archivo debe ser una URL válida.",
            "any.required": "El archivo es obligatorio."
    }),
    subidoPor: Joi.string()
        .min(5)
        .max(100)
        .optional(),
    id_actividad: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional()
        .messages({
            "number.base": "La actividad debe ser un id numérico.",
            "number.positive": "La actividad debe ser un número positivo."
    }),
}).unknown(false);
