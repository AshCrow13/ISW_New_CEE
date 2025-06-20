"use strict";
import { EntitySchema } from "typeorm";

const HistorialSchema = new EntitySchema({
    name: "Historial",
    tableName: "historial",
    columns: {
        id: {  
            type: "int", 
            primary: true, 
            generated: true },
        usuario: { 
            type: "varchar", 
            length: 255, 
            nullable: false }, // puede ser email o nombre
        accion: { 
            type: "varchar", 
            length: 50, 
            nullable: false }, // crear, editar, eliminar
        tipo: { 
            type: "varchar", 
            length: 30, 
            nullable: false }, // actividad, documento, etc
        referenciaId: { 
            type: "int", 
            nullable: true }, // id del recurso modificado
        fecha: { 
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP", 
            nullable: false },
    }
});

export default HistorialSchema;
