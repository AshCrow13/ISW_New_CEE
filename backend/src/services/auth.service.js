"use strict";
import Estudiante from "../entity/estudiante.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(estudiante) {
  try { // Validar que el cuerpo de la solicitud cumpla con el esquema
    const estudianteRepository = AppDataSource.getRepository(Estudiante);
    const { email, rut, password } = estudiante;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    // Determinar el campo de búsqueda (email o rut)
    let whereCondition = {};
    if (email) {
      whereCondition = { email };
    } else if (rut) {
      whereCondition = { rut };
    } else {
      return [null, createErrorMessage("auth", "Se requiere correo o RUT para iniciar sesión")];
    }

    const estudianteFound = await estudianteRepository.findOne({
      where: whereCondition
    });

    if (!estudianteFound) { // Si no se encuentra el estudiante por email o rut
      return [
        null,
        createErrorMessage(
          email ? "email" : "rut",
          "El " + (email ? "correo electrónico" : "RUT") + " no está registrado"
        )
      ];
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isMatch = await comparePassword(password, estudianteFound.password); 

    if (!isMatch) { // Si la contraseña no coincide
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = { // Crear el payload del token
      nombreCompleto: estudianteFound.nombreCompleto,
      email: estudianteFound.email,
      rut: estudianteFound.rut,
      rol: estudianteFound.rol,
      carrera: estudianteFound.carrera,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { // Firmar el token con la clave secreta
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerService(estudiante) {
  try { // Validar que el cuerpo de la solicitud cumpla con el esquema
    const estudianteRepository = AppDataSource.getRepository(Estudiante);

    const { nombreCompleto, rut, email, password } = estudiante;

    const createErrorMessage = (dataInfo, message) => ({ // Crear un objeto de error con información específica
      dataInfo,
      message
    });

    // Validar formato de RUT (solo con puntos)
    const rutRegexConPuntos = /^(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}-[\dkK]$/;
    if (!rutRegexConPuntos.test(rut)) { // Si el RUT no cumple con el formato esperado
      return [null, createErrorMessage("rut", "El RUT debe tener formato xx.xxx.xxx-x")];
    }

    // Validación de formato de correo institucional
    if (!email.match(/@(alumnos\.)?ubiobio\.cl$/)) { // Si el correo no es institucional
      return [null, createErrorMessage("email", "Solo se aceptan correos institucionales")];
    }

    // Validación de longitud de contraseña
    if (password.length < 8) {
      return [null, createErrorMessage("password", "La contraseña debe tener al menos 8 caracteres")];
    }

    // Verificar si ya existe un usuario con el mismo correo
    const existingEmailEstudiante = await estudianteRepository.findOne({
      where: { email }
    });
    
    if (existingEmailEstudiante) { // Si ya existe un estudiante con el mismo correo
      return [null, createErrorMessage("email", "Este correo electrónico ya está registrado")];
    }

    // Verificar si ya existe un usuario con el mismo RUT
    const existingRutEstudiante = await estudianteRepository.findOne({
      where: { rut }
    });

    if (existingRutEstudiante) { // Si ya existe un estudiante con el mismo RUT
      return [null, createErrorMessage("rut", "Este RUT ya está registrado")];
    }

    // Determinar la carrera según el dominio del correo o usar valor por defecto
    let carrera = estudiante.carrera;
    if (!carrera) {
      // Si el email es @alumnos.ubiobio.cl, asumimos que es "Ingeniería Civil Informática"
      // Si el email es @ubiobio.cl, asumimos que es "Personal UBB"
      carrera = email.includes("@alumnos.") ? "Ingeniería Civil Informática" : "Personal UBB";
    }

    const newEstudiante = estudianteRepository.create({ // Crear una nueva instancia de Estudiante
      nombreCompleto,
      email,
      rut,
      rol: estudiante.rol || "estudiante",
      carrera, // Usamos la carrera determinada o proporcionada
      password: await encryptPassword(password),
    });

    await estudianteRepository.save(newEstudiante); // Guardar el nuevo estudiante en la base de datos

    const { password: _, ...dataEstudiante } = newEstudiante; // Excluir la contraseña del objeto de respuesta

    return [dataEstudiante, null];
  } catch (error) {
    console.error("Error al registrar un estudiante", error);
    return [null, { dataInfo: "general", message: "Error interno del servidor" }];
  }
}