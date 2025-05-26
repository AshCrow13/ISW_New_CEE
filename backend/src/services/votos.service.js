import votosSchema from "../entity/votos.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function postVoto(usuarioId, votacionId, opcionId) {
    try {
        const votoRep = AppDataSource.getRepository(votosSchema);
        //Verificamos que en la votacion no haya votado el usuario anteriomente
        const votoExiste = await votoRep.findOne({
            where: {
                usuario:{ id: usuarioId},
                votacion:{ id: votacionId},
        },
    });
    if(votoExiste) {
        return [null, "El usuario ya ha votado en esta votación"];
    }

    const newVoto = votoRep.create({
        usuario: { id: usuarioId },
        votacion: { id: votacionId },
        opcion: { id: opcionId },
    })
    const votoGuardado = await votoRep.save(newVoto);
    return [votoGuardado, null];
    } catch (error) {
        return [null, "Error interno del servidor"];
    } 
};

//Obtener todos los votos de una votacion
export async function getVotos(votacionId) {
    try {
        const votoRep = AppDataSource.getRepository(votosSchema);
        const votos = await votoRep.find({
            where: {
                votacion: { id: votacionId },
            },
            relations: ["usuario", "votacion", "opcion"],
        });
        if (votos.length === 0) {
            return [null, "No se encontraron votos para esta votación"];
        };
        return [votos, null];
    } catch (error) {
        console.error("Error al obtener los votos:", error);
        return [null, "Error interno del servidor"];
    }
};

export async function getConteo(votacionId) {
    try {
        const votoRep = AppDataSource.getRepository(votosSchema);
        const conteo = await votoRep
            .createQueryBuilder("voto")
            .select("opcion.id", "opcionId")
            .addSelect("COUNT(voto.id)", "conteo")
            .where("voto.votacion.id = :votacionId", { votacionId })
            .groupBy("opcion.id")
            .getRawMany();
        return [conteo, null];
    } catch (error) {
        console.error("Error al obtener el conteo de votos:", error);
        return [null, "Error interno del servidor"];
    }
}