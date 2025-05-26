"use strict";
import Joi from "joi";

export const instanciaSchema = Joi.object({
    Temas: Joi.string()
        .min(2)
        .max(300)
        .required()
        .messages({
            "string.empty": "El tema no puede estar vacío.",
            "string.min": "El tema debe tener al menos 2 caracteres.",
            "string.max": "El tema debe tener máximo 300 caracteres.",
            "any.required": "El tema es obligatorio."
        }),
    Fecha: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "La fecha debe ser válida.",
            "any.required": "La fecha es obligatoria."
        }),
    Sala: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "La Sala no puede estar vacío.",
            "string.min": "La Sala debe tener al menos 3 caracteres.",
            "string.max": "La Sala debe tener máximo 100 caracteres.",
            "any.required": "La Sala es obligatorio."
        }),
}).unknown(false);

export const instanciaUpdateSchema = Joi.object({
    Temas: Joi.string()
    .min(2)
    .max(300),
    Fechas: Joi.date ()
        .iso(),
    Sala: Joi.string()
    .min(2)
    .max(100),
}).unknown(false);

export const instanciaQuerySchema = Joi.object({
    Fechas: Joi.date()
        .iso(),
}).or("Fechas").unknown(false);