"use strict"
import { handleErrorServer } from "../handlers/responseHandlers";
import { 
    postVoto,
    getVotos,
    getConteo
 } from "../services/votos.service"
 import { votosQueryValidation, votosBodyValidation } from "../validations/votos.validation";


export async function postVoto(req, res){
    try{
        const usuarioId = req.usuario.id;
        const { errorb } = votosBodyValidation.validate(req.body);
        if (errorb) return handleErrorClient(res, 400, error.message);
        const { error: errorQuery } = votosQueryValidation.validate(req.params);
        if (errorQuery) return handleErrorClient(res, 400, errorQuery.message);

        const { votacionId, opcionId } = req.body;

        const [voto, error] = await votar({usuarioId, votacionId, opcionId});

        if (error) {
            return res.status(400).json({ message: error });
        }
        handleSuccess(res, 201, "Voto registrado", voto);
    } catch (error) {
        console.error("Error al crear el voto:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function getVotos(req, res){
    try{
        const votacionId = req.params.id;
        const { errorq } = votosQueryValidation.validate({ id: votacionId });
        if (errorq) return handleErrorClient(res, 400, errorq.message);
        const [votos, error] = await getVotos(Number(votacionId));

        if (error) {
            return res.status(400).json({ message: error });
        }
        handleSuccess(res, 200, "Votos obtenidos", votos);

    } catch (error) {
        console.error("Error al obtener los votos:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function getConteo(req, res){
    try{
        const votacionId = req.params.id;
        const { errorq } = votosQueryValidation.validate({ id: votacionId });
        if (errorq) return handleErrorClient(res, 400, errorq.message);
        const [conteo, error] = await getConteo(Number(votacionId));
        if (error) {
            return res.status(400).json({ message: error });
        }
        handleSuccess(res, 200, "Conteo de votos", conteo);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor");
    }
}