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
        .valid("Importantes", "Actividad", "Actas", "Otros")
        .required()
        .messages({
            "any.only": "El tipo debe ser Importantes, Actividad, Actas u Otros.",
            "any.required": "El tipo es obligatorio."
        }),
    urlArchivo: Joi.string() // ✅ RELAJAR la validación de URL
        .required()
        .messages({
            "string.empty": "El archivo es obligatorio.",
            "any.required": "El archivo es obligatorio."
        }),
    subidoPor: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.empty": "El campo subidoPor no puede estar vacío.",
            "string.min": "El campo subidoPor debe tener al menos 5 caracteres.",
            "string.max": "El campo subidoPor debe tener máximo 100 caracteres.",
            "any.required": "El campo subidoPor es obligatorio."
        }),
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
        .valid("Importantes", "Actividad", "Actas", "Otros"),
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
        .valid("Importantes", "Actividad", "Actas", "Otros"),
    id_actividad: Joi.number()
        .integer()
        .positive(),
}).or("id", "tipo", "id_actividad").unknown(false);