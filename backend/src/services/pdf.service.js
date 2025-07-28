"use strict";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource } from "../config/configDb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generarPDFResultados(votacionId, esAutomatico = false) {
    try {
        // Obtener datos de la votación con sus opciones y votos
        const votacionRepository = AppDataSource.getRepository("Votacion");
        const votosRepository = AppDataSource.getRepository("Voto");

        // Buscar la votación
        const votacion = await votacionRepository.findOne({
            where: { id: votacionId },
            relations: ["opciones"]
        });

        if (!votacion) {
            return [null, "Votación no encontrada"];
        }

        // Obtener resultados de cada opción
        const resultados = [];
        let totalVotos = 0;

        for (const opcion of votacion.opciones) {
            const countVotos = await votosRepository.count({
                where: { 
                    votacion: { id: votacionId },
                    opcion: { id: opcion.id }
                }
            });
            
            resultados.push({
                opcion: opcion.texto,
                votos: countVotos
            });
            totalVotos += countVotos;
        }

        // Usar directorio uploads existente
        const uploadsDir = path.join(__dirname, "..", "..", "uploads");
        
        // Generar nombre único para el archivo
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const prefijo = esAutomatico ? 'auto-resultados' : 'resultados';
        const fileName = `${prefijo}-votacion-${votacionId}-${timestamp}.pdf`;
        const filePath = path.join(uploadsDir, fileName);

        // Crear el documento PDF
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(filePath));

        // Configurar fuentes y estilos
        const primaryColor = '#2563eb';
        const secondaryColor = '#64748b';
        const textColor = '#1e293b';

        // Encabezado
        doc.fontSize(24)
           .fillColor(primaryColor)
           .text('RESULTADOS DE VOTACIÓN', 50, 50, { align: 'center' });

        // Indicador de generación automática si aplica
        if (esAutomatico) {
            doc.fontSize(10)
               .fillColor('#16a34a')
               .text('📄 Generado automáticamente al cierre de votación', 50, 75, { align: 'center' });
        }

        // Línea separadora
        const lineY = esAutomatico ? 95 : 85;
        doc.moveTo(50, lineY)
           .lineTo(550, lineY)
           .strokeColor(primaryColor)
           .lineWidth(2)
           .stroke();

        // Información de la votación
        let yPosition = lineY + 25;
        doc.fontSize(16)
           .fillColor(textColor)
           .text('Información de la Votación', 50, yPosition);

        yPosition += 30;
        doc.fontSize(12)
           .fillColor(secondaryColor)
           .text(`Nombre: ${votacion.nombre}`, 70, yPosition);

        yPosition += 20;
        doc.text(`Fecha de inicio: ${new Date(votacion.inicio).toLocaleString('es-ES')}`, 70, yPosition);

        yPosition += 20;
        doc.text(`Fecha de fin: ${new Date(votacion.fin).toLocaleString('es-ES')}`, 70, yPosition);

        yPosition += 20;
        doc.text(`Estado: ${votacion.estado ? 'Abierta' : 'Cerrada'}`, 70, yPosition);

        yPosition += 20;
        doc.text(`Total de votos: ${totalVotos}`, 70, yPosition);

        // Resultados
        yPosition += 50;
        doc.fontSize(16)
           .fillColor(textColor)
           .text('Resultados Detallados', 50, yPosition);

        yPosition += 30;

        // Gráfico de torta
        if (totalVotos > 0) {
            const pieCenter = { x: 150, y: yPosition + 120 };
            const pieRadius = 80;
            const colors = [
                '#2563eb', '#dc2626', '#16a34a', '#ca8a04', 
                '#9333ea', '#c2410c', '#0891b2', '#be123c',
                '#4338ca', '#059669', '#d97706', '#7c3aed'
            ];

            let currentAngle = -Math.PI / 2; // Empezar desde arriba

            // Dibujar cada sector del gráfico de torta
            resultados.forEach((resultado, index) => {
                const porcentaje = (resultado.votos / totalVotos) * 100;
                const angleSize = (resultado.votos / totalVotos) * 2 * Math.PI;
                const color = colors[index % colors.length];

                if (resultado.votos > 0) {
                    // Dibujar sector
                    doc.save();
                    doc.fillColor(color);
                    
                    // Crear el path del sector
                    doc.path(`M ${pieCenter.x} ${pieCenter.y}`)
                       .arc(pieCenter.x, pieCenter.y, pieRadius, currentAngle, currentAngle + angleSize, false)
                       .lineTo(pieCenter.x, pieCenter.y)
                       .fill();
                    
                    doc.restore();
                }

                currentAngle += angleSize;
            });

            // Leyenda del gráfico
            let legendY = yPosition + 50;
            const legendX = 280;

            doc.fontSize(14)
               .fillColor(textColor)
               .text('Leyenda:', legendX, legendY);

            legendY += 25;

            resultados.forEach((resultado, index) => {
                const porcentaje = totalVotos > 0 ? ((resultado.votos / totalVotos) * 100).toFixed(1) : 0;
                const color = colors[index % colors.length];

                // Cuadrado de color
                doc.rect(legendX, legendY - 2, 12, 12)
                   .fillColor(color)
                   .fill();

                // Texto de la leyenda
                doc.fontSize(10)
                   .fillColor(textColor)
                   .text(`${resultado.opcion} (${porcentaje}%)`, legendX + 20, legendY, { width: 200 });

                legendY += 18;
            });

            yPosition += 250; // Espacio para el gráfico y leyenda
        }

        // Tabla de resultados detallados
        doc.fontSize(14)
           .fillColor(textColor)
           .text('Tabla de Resultados', 50, yPosition);

        yPosition += 25;

        // Encabezados de la tabla
        doc.fontSize(11)
           .fillColor(secondaryColor)
           .text('#', 70, yPosition, { width: 30 })
           .text('Opción', 100, yPosition, { width: 200 })
           .text('Votos', 320, yPosition, { width: 60 })
           .text('Porcentaje', 400, yPosition, { width: 80 });

        yPosition += 20;

        // Línea separadora de encabezados
        doc.moveTo(70, yPosition)
           .lineTo(480, yPosition)
           .strokeColor(secondaryColor)
           .lineWidth(1)
           .stroke();

        yPosition += 10;

        // Filas de datos
        resultados.forEach((resultado, index) => {
            const porcentaje = totalVotos > 0 ? ((resultado.votos / totalVotos) * 100).toFixed(1) : 0;
            
            doc.fontSize(10)
               .fillColor(textColor)
               .text(`${index + 1}`, 70, yPosition, { width: 30 })
               .text(resultado.opcion, 100, yPosition, { width: 200 })
               .text(`${resultado.votos}`, 320, yPosition, { width: 60 })
               .text(`${porcentaje}%`, 400, yPosition, { width: 80 });

            // Barra de progreso visual pequeña
            const barWidth = 60;
            const barHeight = 6;
            const fillWidth = totalVotos > 0 ? (resultado.votos / totalVotos) * barWidth : 0;
            
            yPosition += 15;
            
            // Fondo de la barra
            doc.rect(100, yPosition, barWidth, barHeight)
               .fillColor('#e2e8f0')
               .fill();
            
            // Relleno de la barra
            if (fillWidth > 0) {
                doc.rect(100, yPosition, fillWidth, barHeight)
                   .fillColor(primaryColor)
                   .fill();
            }

            yPosition += 20;
        });

        // Pie de página
        const pageHeight = doc.page.height;
        doc.fontSize(10)
           .fillColor(secondaryColor)
           .text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 50, pageHeight - 50, { align: 'center' });

        doc.text('Sistema de Votaciones - Centro de Estudiantes', 50, pageHeight - 35, { align: 'center' });

        // Finalizar el documento
        doc.end();

        try {
            const documentoRepo = AppDataSource.getRepository("Documento");
            const estudianteRepo = AppDataSource.getRepository("Estudiante");
            
            // Buscar un usuario administrador para asociar el documento
            const adminUser = await estudianteRepo.findOne({ 
                where: { rol: "admin" } 
            });
            
            if (adminUser) {
                const pdfDocumento = documentoRepo.create({
                    titulo: `Resultados de Votación: ${votacion.nombre}`,
                    tipo: "Actas",
                    urlArchivo: `/api/documentos/download/${fileName}`, // Mantener el nombre del archivo
                    subidoPor: adminUser,
                    fechaSubida: new Date()
                });
                
                const savedDocumento = await documentoRepo.save(pdfDocumento);
                
                console.log(`📄 PDF guardado en base de datos: ${savedDocumento.titulo} (ID: ${savedDocumento.id})`);
                console.log(`� Archivo guardado en: uploads/${fileName}`);
            } else {
                console.warn("⚠️ No se encontró usuario administrador para asociar el PDF");
            }
        } catch (dbError) {
            console.error("Error al guardar PDF en base de datos:", dbError);
            // No fallar si hay error en la BD, el PDF ya está generado
        }

        return [filePath, null];

    } catch (error) {
        console.error("Error al generar PDF:", error);
        return [null, error.message];
    }
}