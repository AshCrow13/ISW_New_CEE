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
    responsableId: Joi.number() // ✅ CAMBIO: Usar responsableId como número
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El responsable debe ser un ID numérico.",
            "number.positive": "El responsable debe ser un número positivo.",
            "any.required": "El responsable es obligatorio."
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
}).unknown(true); // ✅ CAMBIO PRINCIPAL: Permitir campos adicionales

export const actividadUpdateSchema = Joi.object({
    titulo: Joi.string()
        .min(5)
        .max(100),
    descripcion: Joi.string()
        .min(10)
        .max(2000),
    fecha: Joi.date()
        .iso(),
    lugar: Joi.string()
        .min(5)
        .max(100),
    categoria: Joi.string()
        .valid("Deportivo", "Recreativo", "Oficial"),
    responsable: Joi.string()
        .min(5)
        .max(100),
    recursos: Joi.string()
        .max(500)
        .allow(null, ""),
    estado: Joi.string()
        .valid("publicada", "pendiente", "finalizada"),
}).unknown(false);

export const actividadQuerySchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive(),
    categoria: Joi.string()
        .valid("Deportivo", "Recreativo", "Oficial"),
    fecha: Joi.date()
        .iso(),
}).or("id", "categoria", "fecha").unknown(false);