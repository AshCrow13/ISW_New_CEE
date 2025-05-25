import votosSchema from "../entity/votos.entity";
import { AppDataSource } from "../config/configDb";

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