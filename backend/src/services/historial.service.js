import Historial from "../entity/historial.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";

// Esta función obtiene el historial de acciones realizadas, con filtros
export async function getHistorialService(filtro = {}) {
    try { 
        const repo = AppDataSource.getRepository(Historial);
        const where = {};

        // Filtrar por email del usuario relacionado
        if (filtro.usuarioEmail) {
            where.usuario = { email: filtro.usuarioEmail };
        } else if (filtro.usuarioId) {
            where.usuario = { id: parseInt(filtro.usuarioId) };
        }
        if (filtro.accion) where.accion = filtro.accion;
        if (filtro.tipo) where.tipo = filtro.tipo;
        if (filtro.referenciaId) where.referenciaId = parseInt(filtro.referenciaId);

        // Filtrar por fecha
        if (filtro.fechaInicio && filtro.fechaFin) {
            where.fecha = Between(filtro.fechaInicio, filtro.fechaFin);
        } else if (filtro.fechaInicio) {
            where.fecha = MoreThanOrEqual(filtro.fechaInicio);
        } else if (filtro.fechaFin) {
            where.fecha = LessThanOrEqual(filtro.fechaFin);
        }

        // ✅ OBTENER datos RAW con relaciones
        const historialRaw = await repo.find({ 
            where, 
            order: { fecha: "DESC" }, 
            relations: ["usuario"] 
        });

        // ✅ FORMATEAR datos para el frontend
        const historial = historialRaw.map(item => {
            // Formatear usuario
            let usuarioFormateado = 'Sistema';
            if (item.usuario) {
                if (item.usuario.nombreCompleto) {
                    usuarioFormateado = item.usuario.nombreCompleto;
                } else if (item.usuario.email) {
                    usuarioFormateado = item.usuario.email;
                }
            }

            // Formatear detalle
            let detalle = `${item.accion} ${item.tipo}`;
            if (item.referenciaId) {
                detalle += ` (ID: ${item.referenciaId})`;
            }

            return {
                id: item.id,
                fecha: item.fecha, // ✅ Mantener fecha original
                accion: item.accion,
                tipo: item.tipo,
                referenciaId: item.referenciaId,
                usuario: usuarioFormateado, // ✅ Campo usuario formateado
                usuarioEmail: item.usuario?.email || 'sistema@cee.cl',
                detalle: detalle, // ✅ Campo detalle generado
                // Datos originales para compatibilidad
                usuarioCompleto: item.usuario
            };
        });

        console.log('📊 Historial formateado:', historial.slice(0, 2)); // ✅ DEBUG
        return [historial, null];
    } catch (error) {
        console.error('❌ Error en getHistorialService:', error); // ✅ DEBUG
        return [null, "Error al obtener historial: " + error.message];
    }
}
