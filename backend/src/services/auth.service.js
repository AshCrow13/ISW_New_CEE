"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email }
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
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


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(user.password),
      rol: "usuario",
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}

/*

// VERIFICAR QUE EL CODIGO FUNCIONA CON LOS DEMAS ARCHIVOS******

"use strict";
import Estudiante from "../entity/estudiante.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import bcrypt from "bcryptjs";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

// LOGIN
export async function loginEstudianteService({ email, rut, password }) {
  try {
    const estudianteRepo = AppDataSource.getRepository(Estudiante);

    let estudiante = null;
    if (email) {
      estudiante = await estudianteRepo.findOne({ where: { email } });
    } else if (rut) {
      estudiante = await estudianteRepo.findOne({ where: { rut } });
    }

    if (!estudiante) return [null, null, "El usuario no existe."];
    if (!estudiante.password) return [null, null, "El usuario no tiene contraseña registrada."];

    const isMatch = await bcrypt.compare(password, estudiante.password);
    if (!isMatch) return [null, null, "Contraseña incorrecta."];

    const payload = {
      id: estudiante.id,
      nombreCompleto: estudiante.nombreCompleto,
      rut: estudiante.rut,
      email: estudiante.email,
      carrera: estudiante.carrera,
    };

    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    const { password: _, ...estudianteSinPassword } = estudiante;

    return [token, estudianteSinPassword, null];
  } catch (error) {
    return [null, null, "Error interno al autenticar: " + error.message];
  }
}

// REGISTRO
export async function registerEstudianteService(data) {
  try {
    const estudianteRepo = AppDataSource.getRepository(Estudiante);

    const existingRut = await estudianteRepo.findOne({ where: { rut: data.rut } });
    if (existingRut) return [null, "Ya existe un estudiante con ese RUT."];

    const existingEmail = await estudianteRepo.findOne({ where: { email: data.email } });
    if (existingEmail) return [null, "Ya existe un estudiante con ese email."];

    let passwordHasheado = undefined;
    if (data.password) {
      passwordHasheado = await bcrypt.hash(data.password, 10);
    }

    const estudiante = estudianteRepo.create({
      ...data,
      password: passwordHasheado,
    });
    await estudianteRepo.save(estudiante);

    const { password: _, ...estudianteSinPassword } = estudiante;
    return [estudianteSinPassword, null];
  } catch (error) {
    return [null, "Error al registrar estudiante: " + error.message];
  }
}


*/