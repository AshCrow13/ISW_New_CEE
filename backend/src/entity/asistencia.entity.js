import { EntitySchema } from "typeorm";

const Asistencia = new EntitySchema({
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
    nombreCompleto: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 12,
      nullable: false,
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

export default Asistencia;