"use strict";
import { generarPDFResultados} from "../services/pdf.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { votacionQueryValidation } from "../validations/votacion.validation.js";
import fs from "fs";
import path from "path";

export async function generarPDFResultadosVotacion(req, res) {
    try {
        const { id } = req.params;
        
        // Validar el ID de la votación
        const { error } = votacionQueryValidation.validate({ id });
        if (error) return handleErrorClient(res, 400, error.message);

        // Generar el PDF
        const [filePath, errorPDF] = await generarPDFResultados(parseInt(id));
        
        if (errorPDF) {
            return handleErrorClient(res, 400, errorPDF);
        }

        // Verificar que el archivo existe
        if (!fs.existsSync(filePath)) {
            return handleErrorServer(res, 500, "Error al generar el archivo PDF");
        }

        // Configurar headers para descarga
        const fileName = path.basename(filePath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        // Enviar el archivo
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Opcional: eliminar el archivo después de enviarlo
        fileStream.on('end', () => {
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error al eliminar archivo temporal:', err);
            });
        });

    } catch (error) {
        console.error("Error en generarPDFResultadosVotacion:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function obtenerResultadosVotacion(req, res) {
    try {
        const { id } = req.params;
        
        // Validar el ID de la votación
        const { error } = votacionQueryValidation.validate({ id });
        if (error) return handleErrorClient(res, 400, error.message);

        const { AppDataSource } = await import("../config/configDb.js");
        const votacionRepository = AppDataSource.getRepository("Votacion");
        const votosRepository = AppDataSource.getRepository("Voto");

        // Buscar la votación
        const votacion = await votacionRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["opciones"]
        });

        if (!votacion) {
            return handleErrorClient(res, 404, "Votación no encontrada");
        }

        // Obtener resultados de cada opción
        const resultados = [];
        let totalVotos = 0;

        for (const opcion of votacion.opciones) {
            const countVotos = await votosRepository.count({
                where: { 
                    votacion: { id: parseInt(id) },
                    opcion: { id: opcion.id }
                }
            });
            
            resultados.push({
                id: opcion.id,
                opcion: opcion.texto,
                votos: countVotos,
                porcentaje: 0 // Se calculará después
            });
            totalVotos += countVotos;
        }

        // Calcular porcentajes
        resultados.forEach(resultado => {
            resultado.porcentaje = totalVotos > 0 ? 
                parseFloat(((resultado.votos / totalVotos) * 100).toFixed(1)) : 0;
        });

        // Ordenar por número de votos (descendente)
        resultados.sort((a, b) => b.votos - a.votos);

        const response = {
            votacion: {
                id: votacion.id,
                nombre: votacion.nombre,
                estado: votacion.estado,
                inicio: votacion.inicio,
                fin: votacion.fin,
                duracion: votacion.duracion
            },
            resultados: resultados,
            totalVotos: totalVotos,
            fechaConsulta: new Date().toISOString()
        };

        handleSuccess(res, 200, "Resultados obtenidos correctamente", response);

    } catch (error) {
        console.error("Error en obtenerResultadosVotacion:", error);
        handleErrorServer(res, 500, error.message);
    }
}
