"use strict";
import Estudiante from "../entity/estudiante.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(estudiante) {
  try {
    const estudianteRepository = AppDataSource.getRepository(Estudiante);
    const { email, password } = estudiante;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const estudianteFound = await estudianteRepository.findOne({
      where: { email }
    });

    if (!estudianteFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, estudianteFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      nombreCompleto: estudianteFound.nombreCompleto,
      email: estudianteFound.email,
      rut: estudianteFound.rut,
      rol: estudianteFound.rol,
      carrera: estudianteFound.carrera,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerService(estudiante) {
  try {
    const estudianteRepository = AppDataSource.getRepository(Estudiante);

    const { nombreCompleto, rut, email } = estudiante;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailEstudiante = await estudianteRepository.findOne({
      where: {
        email,
      },
    });
    
    if (existingEmailEstudiante) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutEstudiante = await estudianteRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutEstudiante) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    const newEstudiante = estudianteRepository.create({
      nombreCompleto,
      email,
      rut,
      rol: estudiante.rol || "estudiante",
      carrera: estudiante.carrera,
      password: await encryptPassword(estudiante.password),
    });

    await estudianteRepository.save(newEstudiante);

    const { password, ...dataEstudiante } = newEstudiante;

    return [dataEstudiante, null];
  } catch (error) {
    console.error("Error al registrar un estudiante", error);
    return [null, "Error interno del servidor"];
  }
}