"use strict"
import { EntitySchema } from "typeorm";

const feedbackSchema = new EntitySchema({
    name: "Feedback",
    tableName: "feedbacks",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        comentario: {
            type: "text",
            nullable: false,
        },
        fechaCreacion: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        usuarioName: {
            type: "varchar",
            nullable: true,
        },
        anonimo: {
            type: "boolean",
            default: false,
        },
    }
    })

export default feedbackSchema;