"use strict"
import { handleErrorServer } from "../handlers/responseHandlers.js";
import { 
    postVoto as postVotoService,
    getVotos as getVotosService,
    getConteo as getConteoService,
 } from "../services/votos.service.js"
 import { votosQueryValidation, votosBodyValidation } from "../validations/votos.validation.js";
import { handleErrorClient, handleSuccess } from "../handlers/responseHandlers.js";

  
export async function postVoto(req, res){
    try{
        if (req.user.carrera !== "Ingeniería en Computación e Informática") {
            return res.status(403).json({ message: "Solo estudiantes de Ingeniería en Computación e Informática pueden votar" });
        }
        const usuarioId = req.user.id;
        const { errorb } = votosBodyValidation.validate(req.body);
        if (errorb) return handleErrorClient(res, 400, "Error en el cuerpo de la solicitud: " + errorb.message);

        const { error: errorQuery } = votosQueryValidation.validate({votacionId: req.params.votacionId});
        if (errorQuery) return handleErrorClient(res, 400, "El parametro de la votacion es invalido" + errorQuery.message);

        const votacionId = Number(req.params.votacionId);
        const {opcionId } = req.body;
        
        const [voto, error] = await postVotoService(usuarioId, votacionId, opcionId);

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
        if (req.user.carrera !== "Ingeniería en Computación e Informática") {
            return res.status(403).json({ message: "Solo estudiantes de Ingeniería en Computación e Informática pueden ver los votos" });
        }

        const votacionId = req.params.id;
        const { errorq } = votosQueryValidation.validate({ id: votacionId });
        if (errorq) return handleErrorClient(res, 400, errorq.message);
        const [votos, error] = await getVotosService(Number(votacionId));

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
        if (req.user.carrera !== "Ingeniería en Computación e Informática") {
            return res.status(403).json({ message: "Solo estudiantes de Ingeniería en Computación e Informática pueden ver el conteo de votos" });
        }

        const votacionId = req.params.id;
        const { errorq } = votosQueryValidation.validate({ id: votacionId });
        if (errorq) return handleErrorClient(res, 400, errorq.message);
        const [conteo, error] = await getConteoService(Number(votacionId));
        if (error) {
            return res.status(400).json({ message: error });
        }
        handleSuccess(res, 200, "Conteo de votos", conteo);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno del servidor");
    }
}