"use strict";
import Joi from "joi";

export const actividadSchema = Joi.object({
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
    descripcion: Joi.string()
        .min(10)
        .max(2000)
        .required()
        .messages({
            "string.empty": "La descripción no puede estar vacía.",
            "string.min": "La descripción debe tener al menos 10 caracteres.",
            "string.max": "La descripción debe tener máximo 2000 caracteres.",
            "any.required": "La descripción es obligatoria."
        }),
    fecha: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "La fecha debe ser válida.",
            "any.required": "La fecha es obligatoria."
        }),
    lugar: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.empty": "El lugar no puede estar vacío.",
            "string.min": "El lugar debe tener al menos 5 caracteres.",
            "string.max": "El lugar debe tener máximo 100 caracteres.",
            "any.required": "El lugar es obligatorio."
        }),
    categoria: Joi.string()
        .valid("Deportivo", "Recreativo", "Oficial")
        .required()
        .messages({
            "any.only": "La categoría debe ser Deportivo, Recreativo u Oficial.",
            "any.required": "La categoría es obligatoria."
        }),
    responsable: Joi.string()
        .min(5)
        .max(100)
        .optional()
        .messages({
            "string.min": "El responsable debe tener al menos 5 caracteres.",
            "string.max": "El responsable debe tener máximo 100 caracteres.",
        }),
    recursos: Joi.string()
        .max(500)
        .allow(null, "")
        .messages({
            "string.max": "Los recursos deben tener máximo 500 caracteres.",
        }),
    estado: Joi.string()
        .valid("publicada", "pendiente", "finalizada")
        .optional()
        .messages({
            "any.only": "El estado debe ser publicada, pendiente o finalizada."
        })
}).unknown(false);
