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
            type: "string",
            length: 255,
            nullable: false,
        },
        estado: {
            type: "boolean", // true = abierto, false = cerrado
            default: true,
        },
    },
    relations: {
        opciones: {
            type: "one-to-many",
            target: "OpcionVotacion",
            inverseSide: "votacion",
            cascade: true,
        },
    },
});

export default votacionSchema;