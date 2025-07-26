"use strict"
import cron from "node-cron";
import { AppDataSource } from "../config/configDb.js";
import votacionSchema from "../entity/votacion.entity.js";

let isRunning = false; // Flag para evitar ejecuciones simultáneas

// Tarea programada para gestionar estados de votaciones automáticamente - Cada 5 minutos
cron.schedule("*/5 * * * *", async () => {
    if (isRunning) {
        console.log("Cron job ya ejecutándose, omitiendo...");
        return;
    }
    
    isRunning = true;
    
    try {
        const votacionRepository = AppDataSource.getRepository(votacionSchema);
        const ahora = new Date();
        console.log(`[${ahora.toISOString()}] Ejecutando verificación de estados de votaciones...`);

        // 1. Activar votaciones que han llegado a su fecha de inicio
        const votacionesPorIniciar = await votacionRepository
            .createQueryBuilder("votacion")
            .where("votacion.estado = :estado", { estado: false })
            .andWhere("votacion.inicio <= :ahora", { ahora })
            .andWhere("votacion.fin > :ahora", { ahora })
            .limit(50)
            .getMany();

        for (const votacion of votacionesPorIniciar) {
            votacion.estado = true;
            await votacionRepository.save(votacion);
            console.log(`✅ Votación ${votacion.id} ("${votacion.nombre}") iniciada automáticamente.`);
        }

        // 2. Cerrar votaciones que han terminado
        const votacionesPorCerrar = await votacionRepository
            .createQueryBuilder("votacion")
            .where("votacion.estado = :estado", { estado: true })
            .andWhere("votacion.fin < :ahora", { ahora })
            .limit(50)
            .getMany();

        for (const votacion of votacionesPorCerrar) {
            votacion.estado = false;
            await votacionRepository.save(votacion);
            console.log(`❌ Votación ${votacion.id} ("${votacion.nombre}") cerrada automáticamente.`);
        }

        if (votacionesPorIniciar.length === 0 && votacionesPorCerrar.length === 0) {
            console.log("No hay votaciones que requieran cambio de estado.");
        }

    } catch (error) {
        console.error("❌ Error al ejecutar la tarea programada:", error);
    } finally {
        isRunning = false;
    }
});