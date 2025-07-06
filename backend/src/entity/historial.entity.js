"use strict";
import { EntitySchema } from "typeorm";

const HistorialSchema = new EntitySchema({
    name: "Historial",
    tableName: "historial",
    columns: {
        id: { 
            type: "int", 
            primary: true, 
            generated: true 
        },
        accion: { 
            type: "varchar", 
            length: 50, 
            nullable: false 
        },
        tipo: { 
            type: "varchar", 
            length: 30, 
            nullable: false 
        },
        referenciaId: { 
            type: "int", 
            nullable: true 
        },
        fecha: { 
            type: "timestamp with time zone", 
            default: () => "CURRENT_TIMESTAMP", 
            nullable: false 
        }
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "Estudiante",
            joinColumn: { 
                name: "usuario_email", 
                referencedColumnName: "email" 
            },
            nullable: false,
            onDelete: "SET NULL"
        }
    }
});
export default HistorialSchema;
