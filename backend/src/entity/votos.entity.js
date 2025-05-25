"use strict"
import { EntitySchema } from "typeorm";

const votosSchema = new EntitySchema({
    name:"Voto",
    tableName:"votos",
    columns:{
        id:{
            primary:true,
            type:"int",
            generated:true,
        },    
    },
    relations:{
        usuario:{
            type:"many-to-one",
            target:"User",
            JoinColumn: true,
            nullable:false,
        },
        votacion: {
            type:"many-to-one",
            target:"Votacion",
            JoinColumn: true,
            nullable:false,
        },
        opcion: {
            type:"many-to-one",
            target:"OpcionVotacion",
            JoinColumn: true,
            nullable:false,
        },
},
    uniques: [
        {
            name: "voto_unico",
            columns: ["usuario", "votacion"],
        },
    ],
});
export default votosSchema;