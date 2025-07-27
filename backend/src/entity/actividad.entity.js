"use strict";
import { EntitySchema } from "typeorm";
import EstudianteSchema from "./estudiante.entity.js";

const ActividadSchema = new EntitySchema({
    name: "Actividad",
    tableName: "actividades",
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
        descripcion: { // Descripción breve de la actividad
            type: "text", 
            nullable: false 
        },
        fecha: { 
            type: "timestamp with time zone", // Cambiar de "date" a "timestamp with time zone"
            nullable: false 
        },
        lugar: { 
            type: "varchar", 
            length: 100, 
            nullable: false 
        },
        categoria: { // Ejemplo: "charlas", "talleres", "seminarios"
            type: "varchar", 
            length: 50, 
            nullable: false 
        },
        recursos: { // Recursos necesarios para la actividad (ej. materiales, herramientas)
            type: "text", 
            nullable: true 
        },
        estado: { 
            type: "varchar", 
            length: 30, 
            default: "publicada", 
            nullable: false 
        },
        createdAt: { 
            type: "timestamp with time zone", 
            default: () => "CURRENT_TIMESTAMP", 
            nullable: false 
        },
        updatedAt: { 
            type: "timestamp with time zone", 
            default: () => "CURRENT_TIMESTAMP", 
            onUpdate: "CURRENT_TIMESTAMP", 
            nullable: false 
        },
    },
    relations: {
        responsable: { // Estudiante responsable de la actividad
            type: "many-to-one",
            target: "Estudiante",
            joinColumn: { 
                name: "responsable_id", 
                referencedColumnName: "id" 
            },
            nullable: false,
            onDelete: "RESTRICT"
        },
        documentos: { // Documentos asociados a la actividad
            type: "one-to-many",
            target: "Documento",
            inverseSide: "actividad",
            cascade: true // Asegura que los documentos se gestionen con la actividad
        }
    }
});
export default ActividadSchema;

