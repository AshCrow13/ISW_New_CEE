"use strict";
import Joi from "joi";

export const actividadSchema = Joi.object({
    titulo: Joi.string() // Título de la actividad
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.empty": "El título no puede estar vacío.",
            "string.min": "El título debe tener al menos 5 caracteres.",
            "string.max": "El título debe tener máximo 100 caracteres.",
            "any.required": "El título es obligatorio."
        }),
    descripcion: Joi.string() // Descripción de la actividad
        .min(10)
        .max(2000)
        .required()
        .messages({
            "string.empty": "La descripción no puede estar vacía.",
            "string.min": "La descripción debe tener al menos 10 caracteres.",
            "string.max": "La descripción debe tener máximo 2000 caracteres.",
            "any.required": "La descripción es obligatoria."
        }),
    fecha: Joi.date() // Fecha de la actividad
        .iso()
        .required()
        .messages({
            "date.base": "La fecha debe ser válida.",
            "any.required": "La fecha es obligatoria."
        }),
    lugar: Joi.string() // Lugar de la actividad
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.empty": "El lugar no puede estar vacío.",
            "string.min": "El lugar debe tener al menos 5 caracteres.",
            "string.max": "El lugar debe tener máximo 100 caracteres.",
            "any.required": "El lugar es obligatorio."
        }),
    categoria: Joi.string() // Categoría de la actividad
        .valid("Deportivo", "Recreativo", "Oficial")
        .required()
        .messages({
            "any.only": "La categoría debe ser Deportivo, Recreativo u Oficial.",
            "any.required": "La categoría es obligatoria."
        }),
    responsableId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El responsable debe ser un ID numérico.",
            "number.positive": "El responsable debe ser un número positivo.",
            "any.required": "El responsable es obligatorio."
        })
        .custom((value, helpers) => {
            // Permitir strings numéricos (por FormData)
            if (typeof value === "string" && /^\d+$/.test(value)) {
                return parseInt(value, 10);
            }
            return value;
        }),
    recursos: Joi.string() // Recursos de la actividad
        .max(500)
        .allow(null, "")
        .messages({
            "string.max": "Los recursos deben tener máximo 500 caracteres.",
        }),
    estado: Joi.string() // Estado de la actividad
        .valid("publicada", "pendiente", "finalizada")
        .optional()
        .messages({
            "any.only": "El estado debe ser publicada, pendiente o finalizada."
        })
}).unknown(true);

export const actividadUpdateSchema = Joi.object({
    titulo: Joi.string() // Título de la actividad
        .min(5)
        .max(100),
    descripcion: Joi.string() // Descripción de la actividad
        .min(10)
        .max(2000),
    fecha: Joi.date() // Fecha de la actividad
        .iso(),
    lugar: Joi.string() // Lugar de la actividad
        .min(5)
        .max(100),
    categoria: Joi.string() // Categoría de la actividad
        .valid("Deportivo", "Recreativo", "Oficial"),
    responsableId: Joi.number()  // Este campo es el que está causando el problema
        .integer()
        .positive(),
    recursos: Joi.string() // Recursos de la actividad
        .max(500)
        .allow(null, ""),
    estado: Joi.string() // Estado de la actividad
        .valid("publicada", "pendiente", "finalizada"),
}).unknown(false);

export const actividadQuerySchema = Joi.object({
    id: Joi.number() // ID de la actividad
        .integer()
        .positive(),
    categoria: Joi.string() // Categoría de la actividad
        .valid("Deportivo", "Recreativo", "Oficial"),
    fecha: Joi.date() // Fecha de la actividad
        .iso(),
}).or("id", "categoria", "fecha").unknown(false);