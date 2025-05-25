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
            type: "varchar", // Ejemplo: "comunicado", "acta", "resultado"
            length: 30,
            nullable: false,
        },
        urlArchivo: { // URL del archivo almacenado en el servidor
            type: "varchar",
            length: 255,
            nullable: false,
        },
        fechaSubida: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        subidoPor: { // nombre del usuario que subió el documento
            type: "varchar",
            length: 100,
            nullable: false,
        },
        id_actividad: { // ID de la actividad asociada al documento
            type: "int",
            nullable: true,
        },
    },
});

export default DocumentoSchema;
