"use strict"
import { EntitySchema } from "typeorm";

const votacionSchema = new EntitySchema({
    name: "Votacion",
    tableName: "votaciones",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        estado: {
            type: "boolean", // true = abierto, false = cerrado
            default: true,
        },
        inicio: {
            type: "timestamp",
            nullable: false,
        },
        duracion: {
            type: "int", // Duración en minutos
            nullable: false,
        },
        fin: {
            type: "timestamp",
            nullable: false,
        },

    },
    relations: {
        opciones: {
            type: "one-to-many",
            target: "OpcionVotacion",
            inverseSide: "votacion",
            cascade: true,
            onDelete: "CASCADE",
        },
    },
});

export default votacionSchema;