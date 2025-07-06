//* En postgres usar DELETE FROM estudiantes;
//* Luego ejecutar npm run dev del backend para crear los estudiantes nuevamente
//* Revisar si la tabla estudiantes está vacía antes de ejecutar este script
//* En caso de que no esté vacía, no se crearán los estudiantes nuevamente
//* Si tabla estudiantes está vacía, se crearán los estudiantes con los datos de prueba
//* Usando el comando npm run dev del backend
//* Si quieren agregar más estudiantes para pruebas
//* sigan el formato de los estudiantes ya creados

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
          nombreCompleto: "Ana María González Soto",
          rut: "20.123.456-7",
          email: "ana.gonzalez@ubiobio.cl",
          password: await encryptPassword("Admin1234"),
          rol: "admin",
          carrera: "Ingeniería Civil Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Pedro Javier Rivas Lira",
          rut: "20.234.567-8",
          email: "pedro.rivas@alumnos.ubiobio.cl",
          password: await encryptPassword("Vocalia2024"),
          rol: "vocalia",
          carrera: "Ingeniería Civil Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Valentina Fuentes Pérez",
          rut: "20.345.678-9",
          email: "valentina.fuentes@alumnos.ubiobio.cl",
          password: await encryptPassword("Vocalia2024"),
          rol: "vocalia",
          carrera: "Ingeniería Civil Eléctrica",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Carlos Ignacio Torres Vidal",
          rut: "20.456.789-0",
          email: "carlos.torres@alumnos.ubiobio.cl",
          password: await encryptPassword("Estudiante1"),
          rol: "estudiante",
          carrera: "Ingeniería Civil Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Paula Andrea Mella Ruiz",
          rut: "20.567.890-1",
          email: "paula.mella@alumnos.ubiobio.cl",
          password: await encryptPassword("Estudiante2"),
          rol: "estudiante",
          carrera: "Ingeniería en Computación e Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.678.901-2",
          email: "felipe.henriquez@alumnos.ubiobio.cl",
          password: await encryptPassword("Estudiante3"),
          rol: "estudiante",
          carrera: "Ingeniería Civil Informática",
        }),
      ),
      estudianteRepository.save(
        estudianteRepository.create({
          nombreCompleto: "María José Salazar Vera",
          rut: "20.789.012-3",
          email: "mariajose.salazar@alumnos.ubiobio.cl",
          password: await encryptPassword("Vocalia2024"),
          rol: "vocalia",
          carrera: "Ingeniería Civil Industrial",
        }),
      ),
    ]);
    console.log("* => Estudiantes creados exitosamente");
  } catch (error) {
    console.error("Error al crear estudiantes:", error);
  }
}

export { createEstudiantes };