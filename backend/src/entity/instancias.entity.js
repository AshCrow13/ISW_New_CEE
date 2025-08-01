"use strict";
import { EntitySchema } from "typeorm";

const InstanciaSchema = new EntitySchema({
    name: "Instancia",
    tableName:"instancia",
    columns:{
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        Temas: {
            type: "varchar",
            length: 300,
            nullable: false,
        },
        Fecha: {
            type: "timestamp with time zone",
            nullable: false,
        },
        Sala: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        AsistenciaAbierta: {
        type: "boolean",
        default: false,
        nullable: false,
        },
        ClaveAsistencia: {
        type: "varchar",
        length: 6,
        nullable: true,
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

export default InstanciaSchema;