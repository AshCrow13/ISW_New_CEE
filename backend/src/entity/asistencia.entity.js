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
    estudiante: {
      target: "Estudiante",
      type: "many-to-one",
      joinColumn: { 
        name: "correo",          
        referencedColumnName: "email"
      },
      onDelete: "CASCADE",
    },
    instancia: {
      target: "Instancia",
      type: "many-to-one",
      joinColumn: { 
        name: "idInstancia",
        referencedColumnName: "id"
      },
      onDelete: "CASCADE",
    },
  },
});

export default AsistenciaSchema;