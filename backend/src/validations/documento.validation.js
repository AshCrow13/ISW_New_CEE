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
    urlArchivo: Joi.string() // URL del archivo almacenado en el servidor
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

export const documentoUpdateSchema = Joi.object({
    titulo: Joi.string()
        .min(5)
        .max(100),
    tipo: Joi.string()
        .valid("comunicado", "acta", "resultado"),
    urlArchivo: Joi.string()
        .uri(),
    subidoPor: Joi.string()
        .min(5)
        .max(100),
    id_actividad: Joi.number()
        .integer()
        .positive()
        .allow(null),
}).unknown(false);

export const documentoQuerySchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive(),
    tipo: Joi.string()
        .valid("comunicado", "acta", "resultado"),
    id_actividad: Joi.number()
        .integer()
        .positive(),
}).or("id", "tipo", "id_actividad").unknown(false);