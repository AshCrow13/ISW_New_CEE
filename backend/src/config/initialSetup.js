"use strict";
import Estudiante from "../entity/estudiante.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createEstudiantes() {
  try {
    const estudianteRepository = AppDataSource.getRepository(Estudiante);

    const count = await estudianteRepository.count();
    if (count > 0) return;

    await Promise.all([
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Etrius",
          rut: "20.101.700-9",
          email: "matias.cartes2001@alumnos.ubiobio.cl",
          password: await encryptPassword("Etrius"),
          rol: "administrador",
          carrera: "Ingeniería en Computación e Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Crow",
          rut: "19.088.998-0",
          email: "omar.castro2001@alumnos.ubiobio.cl",
          password: await encryptPassword("Crow"),
          rol: "usuario",
          carrera: "Ingeniería en Computación e Informática",
        })
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Chitopan",
          rut: "20.943.041-0",
          email: "Francisco.catrileo2020@alumnos.ubiobio.cl",
          password: await encryptPassword("Chitopan"),
          rol: "usuario",
          carrera: "Ingeniería en Minas",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Prozero",
          rut: "20.487.563-4",
          email: "prozero133@gmail.com",
          password: await encryptPassword("Prozero"),
          rol: "usuario",
          carrera: "Ingeniería en Computación e Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
          carrera: "Ingeniería en Computación e Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Calibre",
          rut: "20.101.700-0",
          email: "as0etrius@gmail.com",
          password: await encryptPassword("Calibre"),
          rol: "usuario",
          carrera: "Ingeniería en Computación e Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
          carrera: "Ingeniería en Computación e Informática",
        }),
      ),
    ]);
    console.log("* => Estudiantes creados exitosamente");
  } catch (error) {
    console.error("Error al crear estudiantes:", error);
  }
}

export { createEstudiantes };