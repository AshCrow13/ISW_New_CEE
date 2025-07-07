"use strict"
import Joi from "joi";

export const votacionQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  nombre: Joi.string()
    .min(5)
    .max(50)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 5 caracteres.",
      "string.max": "El nombre debe tener como máximo 50 caracteres.",
    }),
  estado: Joi.boolean()
    .messages({
      "boolean.base": "El estado debe ser un valor booleano.",
    })
})
  .or("id", "nombre")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un parámetro: id o nombre.",
  });

export const votacionBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(5)
    .max(50)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 5 caracteres.",
      "string.max": "El nombre debe tener como máximo 50 caracteres.",
    }),
  estado: Joi.boolean()
    .required()
    .messages({
      "boolean.base": "El estado debe ser un valor booleano.",
    }),
  opciones: Joi.array()
    .items(
      Joi.string().min(1).max(255)).min(2).required({
        "string.empty": "El texto de la opción no puede estar vacío.",
        "string.base": "El texto de la opción debe ser de tipo string.",
        "string.min": "El texto de la opción debe tener como mínimo 2 caracteres.",
        "string.max": "El texto de la opción debe tener como máximo 255 caracteres.",
      }),
    duracion: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La duración debe ser un número.",
      "number.integer": "La duración debe ser un número entero.",
      "number.positive": "La duración debe ser un número positivo.",
    }),
});

export const votacionUpdateBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(5)
    .max(50)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 5 caracteres.",
      "string.max": "El nombre debe tener como máximo 50 caracteres.",
    }).optional(),
  estado: Joi.boolean()
    .messages({
      "boolean.base": "El estado debe ser un valor booleano.",
    }).optional(),
  opciones: Joi.array()
    .items(
      Joi.string().min(1).max(255)).min(2).messages({
        "string.empty": "El texto de la opción no puede estar vacío.",
        "string.base": "El texto de la opción debe ser de tipo string.",
        "string.min": "El texto de la opción debe tener como mínimo 2 caracteres.",
        "string.max": "El texto de la opción debe tener como máximo 255 caracteres.",
      }
    ).optional(),
  duracion: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "La duración debe ser un número.",
      "number.integer": "La duración debe ser un número entero.",
      "number.positive": "La duración debe ser un número positivo.",
    }).optional()
});