
import cron from "node-cron";
import { AppDataSource } from "../config/configDb.js";
import Actividad from "../entity/actividad.entity.js";
import { enviarCorreoEstudiantes } from "../helpers/email.helper.js";
import Estudiante from "../entity/estudiante.entity.js";

// Programar tarea diaria
cron.schedule("0 8 * * *", async () => {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const ahora = new Date();
        const manana = new Date();
        manana.setDate(ahora.getDate() + 1);

        // Buscar actividades entre ahora y mañana
        const actividades = await repo.createQueryBuilder("actividad")
            .where("actividad.fecha >= :hoy AND actividad.fecha < :manana", {
                hoy: ahora.toISOString().slice(0, 10), // "YYYY-MM-DD"
                manana: manana.toISOString().slice(0, 10)
            })
            .getMany();

        if (actividades.length === 0) return;

        // Aquí se obtiene la lista de estudiantes y para enviar el correo
        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        const emails = estudiantes.map(e => e.email);

        for (const act of actividades) {
            await enviarCorreoEstudiantes(
                `Recordatorio: Actividad "${act.titulo}" es pronto`,
                `
                <p>Recuerda que la actividad <b>${act.titulo}</b> será el <b>${act.fecha}</b> en <b>${act.lugar}</b>.</p>
                <p>No faltes.</p>
                `,
                emails
            );
        }

        
        console.log(`[CRON] ${actividades.length} actividades notificadas para las próximas 24 horas`);
    } catch (err) {
        console.error("[CRON] Error en recordatorio de eventos:", err.message);
    }
});
