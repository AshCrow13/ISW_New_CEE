import { EntitySchema } from "typeorm";

const Asistencia = new EntitySchema({
  name: "Asistencia",
  tableName: "asistencia",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    idInstancia: {
      type: "int",
      nullable: false,
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
  indices: [
    {
      name: "IDX_ASISTENCIA_INSTANCIA_RUT",
      unique: true,
      columns: ["idInstancia", "rut"]
    }
  ]
});

export default Asistencia;