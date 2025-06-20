"use strict"
import Joi from "joi";

export const feedbackBodyValidation = Joi.object({
    comentario: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            "string.empty": "El comentario no puede estar vacío.",
            "string.base": "El comentario debe ser de tipo string.",
            "string.min": "El comentario debe tener como mínimo 5 caracteres.",
            "string.max": "El comentario debe tener como máximo 500 caracteres.",
        }),
    usuarioName: Joi.string()
        .min(5)
        .max(100)
        .optional()
        .messages({
            "string.base": "El nombre de usuario debe ser de tipo string.",
            "string.min": "El nombre de usuario debe tener al menos 5 caracteres.",
            "string.max": "El nombre de usuario debe tener como máximo 100caracteres.",
        }),
    anonimo: Joi.boolean()
        .default(false)
        .messages({
            "boolean.base": "El campo 'anonimo' debe ser un valor booleano.",
        }),
}).unknown(false).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});
