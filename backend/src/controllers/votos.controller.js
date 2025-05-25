"use strict"
import { postVoto } from "../services/votos.service"

export async function postVoto(req, res){
    try{
        const usuarioId = req.usuario.id;
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
};