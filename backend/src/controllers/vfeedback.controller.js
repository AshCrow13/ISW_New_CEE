"use strict"
import {
    postFeedback as postFeedbackService,
    deleteFeedback as deleteFeedbackService,
    getFeedback as getFeedbackService,
    getFeedbacks as getFeedbacksService,
} from "../services/vfeedback.service.js";
import {
    feedbackBodyValidation
} from "../validations/vfeedback.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function postFeedback(req, res) {
    try {
        const { comentario, anonimo } = req.body;
        const { errorb } = feedbackBodyValidation.validate({ comentario, anonimo });
        if (errorb) return handleErrorClient(res, 400, errorb.message);

        const usuarioName = anonimo ? null : req.user.nombreCompleto;

        const body = {
            comentario,
            usuarioName,
            anonimo // Por defecto, no es anónimo
        };

        const [feedback, errorFeedback] = await postFeedbackService(body);
        if (errorFeedback) return handleErrorClient(res, 400, errorFeedback);
        handleSuccess(res, 201, "Feedback creado", feedback);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteFeedback(req, res) {
    try {
        const { id } = req.params.id;
        const [feedback, errorFeedback] = await deleteFeedbackService(id);
        if (errorFeedback) return handleErrorClient(res, 400, errorFeedback);
        handleSuccess(res, 200, "Feedback eliminado", feedback);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getFeedback(req, res) {
    try {
        const id = req.params.id;
        const [feedback, errorFeedback] = await getFeedbackService(id);
        if (errorFeedback) return handleErrorClient(res, 400, errorFeedback);
        handleSuccess(res, 200, "Feedback encontrado", feedback);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getFeedbacks(req, res) {
    try {
        const [feedbacks, errorFeedbacks] = await getFeedbacksService();
        if (errorFeedbacks) return handleErrorClient(res, 400, errorFeedbacks);
        handleSuccess(res, 200, "Feedbacks encontrados", feedbacks);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}