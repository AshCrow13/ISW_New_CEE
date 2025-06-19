"use strict";
import { EntitySchema } from "typeorm";

const EstudianteSchema = new EntitySchema({
    name: "Estudiante",
    tableName: "estudiantes",
    columns: {
        id: { 
            type: "int", 
            primary: true, 
            generated: true },
        nombreCompleto: { 
            type: "varchar", 
            length: 100, 
            nullable: false },
        rut: { 
            type: "varchar", 
            length: 12, 
            nullable: false, 
            unique: true },
        email: {
            type: "varchar",
            length: 255, 
            nullable: false, 
            unique: true },        
        rol:{
            type: "varchar", 
            length: 20, 
            nullable: false, 
            default: "estudiante"
        },
        carrera: { 
            type: "varchar", 
            length: 100, 
            nullable: false },
        password: { 
            type: "varchar", 
            length: 255, 
            nullable: false },
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
    indices: [
        { 
            name: "IDX_ESTUDIANTE_RUT", 
            columns: ["rut"], 
            unique: true 
        },
        { 
            name: "IDX_ESTUDIANTE_EMAIL", 
            columns: ["email"], 
            unique: true 
        },
    ],
});

export default EstudianteSchema;

