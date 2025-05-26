"use strict";
import Joi from "joi";

// Validación para rut chileno*
const rutRegex = /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/;

export const estudianteSchema = Joi.object({
    nombreCompleto: Joi.string()
        .min(8).max(100).required()
        .messages({
            "string.empty": "El nombre completo no puede estar vacío.",
            "string.min": "El nombre debe tener al menos 8 caracteres.",
            "string.max": "El nombre debe tener máximo 100 caracteres.",
            "any.required": "El nombre es obligatorio."
        }),
    rut: Joi.string()
        .min(9).max(12).required().pattern(rutRegex)
        .messages({
            "string.empty": "El RUT no puede estar vacío.",
            "string.pattern.base": "Formato de RUT no válido.",
            "any.required": "El RUT es obligatorio."
        }),
    email: Joi.string().email().min(10).max(255).required()
        .messages({
            "string.email": "El email debe ser válido.",
            "string.empty": "El email no puede estar vacío.",
            "any.required": "El email es obligatorio."
        }),
    carrera: Joi.string().min(3).max(100).required()
        .messages({
            "string.empty": "La carrera no puede estar vacía.",
            "string.min": "La carrera debe tener al menos 3 caracteres.",
            "any.required": "La carrera es obligatoria."
        }),
    password: Joi.string()
        .min(8).max(50).required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "string.min": "La contraseña debe tener al menos 8 caracteres.",
            "string.max": "La contraseña debe tener máximo 50 caracteres.",
            "any.required": "La contraseña es obligatoria."
        }),
    telefono: Joi.string()
        .pattern(/^[0-9+]{9,20}$/)
        .allow(null, "")
        .messages({
            "string.pattern.base": "El teléfono solo puede contener números y +.",
        }),
}).unknown(false);

// Validación para actualizar estudiante
export const estudianteUpdateSchema = Joi.object({
    nombreCompleto: Joi.string()
        .min(8)
        .max(100),
    carrera: Joi.string()
        .min(3)
        .max(100),
    telefono: Joi.string()
        .pattern(/^[0-9+]{9,20}$/)
        .allow(null, ""),
    password: Joi.string()
        .min(8)
        .max(50),
}).unknown(false);

// Validación para eliminar estudiante
export const estudianteQuerySchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive(),
    rut: Joi.string()
        .pattern(rutRegex),
    email: Joi.string()
        .email(),
}).or("id", "rut", "email").unknown(false);

// Validación para login de estudiante
// Se permite el login por email o rut, pero no ambos
export const estudianteLoginSchema = Joi.object({
    email: Joi.string()
        .email()
        .min(10)
        .max(255),
    rut: Joi.string()
        .pattern(rutRegex),
    password: Joi.string()
        .min(8)
        .max(50)
        .required(),
}).or("email", "rut").unknown(false);
