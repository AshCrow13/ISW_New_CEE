"use strict"
import Joi from "joi";

export const votosQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  votacionId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la votación debe ser un número.",
      "number.integer": "El id de la votación debe ser un número entero.",
      "number.positive": "El id de la votación debe ser un número positivo.",
    }),
})
  .or("id", "votacionId")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un parámetro: id o votacionId.",
  });

export const votosBodyValidation = Joi.object({
    votacionId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
        "number.base": "El id de la votación debe ser un número.",
        "number.integer": "El id de la votación debe ser un número entero.",
        "number.positive": "El id de la votación debe ser un número positivo.",
        "any.required": "El id de la votación es obligatorio.",
        }),
    opcionId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
        "number.base": "El id de la opción debe ser un número.",
        "number.integer": "El id de la opción debe ser un número entero.",
        "number.positive": "El id de la opción debe ser un número positivo.",
        "any.required": "El id de la opción es obligatorio.",
        }),
    });
