import { EntitySchema } from "typeorm";

const AsistenciaSchema = new EntitySchema({
  name: "Asistencia",
  tableName: "asistencia",
  columns: {
    correo: {
      type: "varchar",
      primary: true,
    },
    idInstancia: {
      type: "int",
      primary: true,
    },
  },
  relations: {
    estudiantes: {
      target: "Estudiante",
      type: "many-to-one",
      joinColumn: { name: "correo",          
      referencedColumnName: "email"},
      onDelete: "CASCADE",
    },
    instancias: {
      target: "Instancia",
      type: "many-to-one",
      joinColumn: { name: "idInstancia" },
      onDelete: "CASCADE",
    },
  },
});

export default AsistenciaSchema;