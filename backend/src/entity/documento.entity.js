"use strict";
import { EntitySchema } from "typeorm";

const DocumentoSchema = new EntitySchema({
    name: "Documento",
    tableName: "documentos",
    columns: {
        id: { 
            type: "int", 
            primary: true, 
            generated: true 
        },
        titulo: { 
            type: "varchar", 
            length: 100, 
            nullable: false 
        },
        tipo: { // Ejemplo: "comunicado", "acta", "resultado"
            type: "varchar", 
            length: 30, 
            nullable: false 
        },
        urlArchivo: { // URL del archivo almacenado
            type: "varchar", 
            length: 255, 
            nullable: false 
        },
        fechaSubida: { 
            type: "timestamp with time zone", 
            default: () => "CURRENT_TIMESTAMP", 
            nullable: false 
        }
    },
    relations: {
        subidoPor: { // Estudiante que subió el documento
            type: "many-to-one",
            target: "Estudiante",
            joinColumn: { 
                name: "subido_por_id", 
                referencedColumnName: "id" 
            },
            nullable: false,
            onDelete: "RESTRICT"
        },
        actividad: { // Actividad asociada al documento (opcional)
            type: "many-to-one",
            target: "Actividad",
            joinColumn: { 
                name: "id_actividad", 
                referencedColumnName: "id" 
            },
            nullable: true,
            onDelete: "SET NULL"
        }
    }
});
export default DocumentoSchema;

