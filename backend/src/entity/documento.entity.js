"use strict";
import { EntitySchema } from "typeorm";

const DocumentoSchema = new EntitySchema({
    name: "Documento",
    tableName: "documentos",
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
        tipo: {
            type: "varchar",
            length: 30,
            nullable: false,
        // Ejemplo: "comunicado", "acta", "resultado"
        },
        urlArchivo: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        fechaSubida: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        subidoPor: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        id_actividad: {
            type: "int",
            nullable: true,
        },
    },
});

export default DocumentoSchema;
