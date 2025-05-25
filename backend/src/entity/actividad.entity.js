"use strict";
import { EntitySchema } from "typeorm";

const ActividadSchema = new EntitySchema({
    name: "Actividad",
    tableName: "actividades",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        titulo: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        descripcion: {
            type: "text",
            nullable: false,
        },
        fecha: {
            type: "date",
            nullable: false,
        },
        lugar: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        categoria: { // Ejemplo: "charlas", "talleres", "seminarios"
            type: "varchar",
            length: 50,
            nullable: false,
        },
        responsable: { // nombre del responsable de la actividad
            type: "varchar",
            length: 100,
            nullable: false,
        },
        recursos: { // recursos necesarios para la actividad, como materiales o equipos
            type: "text",
            nullable: true,
        },
        estado: {
            type: "varchar",
            length: 30,
            default: "publicada",
            nullable: false,
        },
        createdAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updatedAt: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
});

export default ActividadSchema;
