"use strict"
import { EntitySchema } from "typeorm";

const opcionesSchema = new EntitySchema({
    name: "OpcionVotacion",
    tableName: "opciones_votacion",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        texto: {
            type: "string",
            length: 255,
            nullable: false,
        },
    },
    relations: {
        votacion: {
            type: "many-to-one",
            target: "Votacion",
            joinColumn: true,
            nullable: false,
        },
        votos: {
            type: "one-to-many",
            target: "Voto",
            inverseSide: "opcion",
            cascade: true,
        },
    },
});

export default opcionesSchema;