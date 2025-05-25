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
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
          rut: "20.630.735-8",
          email: "usuario2.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
    ]);
    console.log("* => Estudiantes creados exitosamente");
  } catch (error) {
    console.error("Error al crear estudiantes:", error);
  }
}

export { createEstudiantes };