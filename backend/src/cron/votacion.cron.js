"use strict"
import cron from "node-cron";
import { AppDataSource } from "../config/configDb.js";
import votacionSchema from "../entity/votacion.entity.js";

let isRunning = false; // Flag para evitar ejecuciones simultáneas

// Tarea programada para cerrar votaciones automáticamente - Cada 5 minutos
cron.schedule("*/5 * * * *", async () => {
    try {
        const votacionRepository = AppDataSource.getRepository(votacionSchema);
        const ahora = new Date();

        // Obtener todas las votaciones que han terminado
        const votaciones = await votacionRepository
            .createQueryBuilder("votacion")
            .where("votacion.estado = :estado", { estado: true })
            .andWhere("votacion.fin < :ahora", { ahora })
            .limit(50) // Procesar máximo 50 votaciones por vez
            .getMany();

        for (const votacion of votaciones) {
            votacion.estado = false;
            await votacionRepository.save(votacion);
            console.log(`Votación ${votacion.id} cerrada automáticamente.`);
        }
    } catch (error) {
        console.error("Error al ejecutar la tarea programada:", error);
    }
});