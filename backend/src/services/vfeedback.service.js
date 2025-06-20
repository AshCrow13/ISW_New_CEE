"use strict"
import feedbackSchema from "../entity/vfeedback.entity.js"
import { AppDataSource } from "../config/configDb.js";

export async function postFeedback(body) {
    try {
        const feedbackRepository = AppDataSource.getRepository(feedbackSchema);
        const { comentario, usuarioName, anonimo } = body;

        const nuevoFeedback = feedbackRepository.create({ comentario, usuarioName, anonimo });
        const feedbackGuardado = await feedbackRepository.save(nuevoFeedback);

        return [feedbackGuardado, null];
    } catch (error) {
        console.error("Error al crear el feedback:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getFeedback(body) {
    try {
        const feedbackRepository = AppDataSource.getRepository(feedbackSchema);
        const { id, usuarioId } = body;

        const feedbackFound = await feedbackRepository.findOne({
            where: [{ id: id }, { usuarioId: usuarioId }],
        });

        if (!feedbackFound) return [null, "Feedback no encontrado"];
        return [feedbackFound, null];
    } catch (error) {
        console.error("Error al obtener el feedback:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getFeedbacks() {
    try {
        const feedbackRepository = AppDataSource.getRepository(feedbackSchema);
        const feedbacks = await feedbackRepository.find();
        if (!feedbacks || feedbacks.length === 0) return [null, "No hay feedbacks"];
        return [feedbacks, null];
    } catch (error) {
        console.error("Error al obtener los feedbacks:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteFeedback(id) {
    try {
        const feedbackRepository = AppDataSource.getRepository(feedbackSchema);
        const feedbackToDelete = await feedbackRepository.findOneBy({ id });
        if (!feedbackToDelete) return [null, "Feedback no encontrado"];
        await feedbackRepository.remove(feedbackToDelete);
        return [feedbackToDelete, null];
    } catch (error) {
        console.error("Error al eliminar el feedback:", error);
        return [null, "Error interno del servidor"];
    }
}
