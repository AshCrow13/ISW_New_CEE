/*
import cron from "node-cron";
import { AppDataSource } from "../config/configDb.js";
import Actividad from "../entity/actividad.entity.js";
import Estudiante from "../entity/estudiante.entity.js";
import { enviarCorreoEstudiantes } from "../helpers/email.helper.js";

// Todos los días a las 08:00 AM revisa actividades de las próximas 24h
cron.schedule("0 8 * * *", async () => {
    try {
        const repo = AppDataSource.getRepository(Actividad);
        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        const emails = estudiantes.map(e => e.email);

        // Calcula la fecha actual y la de +24h
        const now = new Date();
        const in24h = new Date(now.getTime() + 24*60*60*1000);
        const actividades = await repo.find({
            where: {
                fecha: Between(now, in24h),
                estado: "publicada"
            }
        });
        if (actividades.length > 0) {
            for (const act of actividades) {
                await enviarCorreoEstudiantes(
                    `Recordatorio: Actividad ${act.titulo}`,
                    `La actividad "${act.titulo}" se realizará el ${act.fecha} en ${act.lugar}.`,
                    emails
                );
            }
        }
    } catch (e) {
        console.log("Error en recordatorio automático:", e.message);
    }
});
*/