"use strict"
import Joi from "joi";

export const opcionesQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  texto: Joi.string()
    .min(1)
    .max(255)
    .messages({
      "string.empty": "El texto no puede estar vacío.",
      "string.base": "El texto debe ser de tipo string.",
      "string.min": "El texto debe tener como mínimo 1 carácter.",
      "string.max": "El texto debe tener como máximo 255 caracteres.",
    }),
})
  .or("id", "texto")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un parámetro: id o texto.",
  });

export const opcionesBodyValidation = Joi.object({
  texto: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "El texto no puede estar vacío.",
      "string.base": "El texto debe ser de tipo string.",
      "string.min": "El texto debe tener como mínimo 1 carácter.",
      "string.max": "El texto debe tener como máximo 255 caracteres.",
    }),
});
