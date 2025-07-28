import nodemailer from "nodemailer";

console.log("Configurando transporter de email...");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Configurado" : "NO CONFIGURADO");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Configurado" : "NO CONFIGURADO");

// Usar variables de entorno o credenciales del middleware original como fallback
const emailUser = process.env.EMAIL_USER || "omarcatrileo20@gmail.com";
const emailPass = process.env.EMAIL_PASS || "smyf jxux xrou jhnq";

const transporter = nodemailer.createTransport({ // Configuración del transporte SMTP
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para el puerto 465
    auth: {
        user: emailUser, // Usuario de correo electrónico
        pass: emailPass, // Contraseña de correo electrónico
    }
});

// Verificar la conexión del transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('Error al verificar el transporte de email:', error);
    } else {
        console.log('Transporter de email verificado correctamente');
    }
});

export async function enviarCorreoEstudiantes(asunto, mensajeHtml, destinatarios, attachments) {
    const mailOptions = { // Opciones del correo
        from: `"Centro de Estudiantes" <${emailUser}>`,
        to: destinatarios, // puede ser un solo email o un array
        subject: asunto,
        html: mensajeHtml,
    };
    if (attachments) {
        mailOptions.attachments = attachments;
    }

    try {
        const info = await transporter.sendMail(mailOptions); // Enviar el correo
        console.log("Correo enviado:", info.messageId); 
        return info;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw error;
    }
}

export async function NotificarAsamblea(destinatario, body) {
    console.log(`NotificarAsamblea: Enviando correo a ${destinatario}`);
    console.log("Datos de la asamblea:", body);
    
    // Formatear la fecha para mostrar día y hora AM/PM
    const formatearFecha = (fechaString) => {
        try {
            const fecha = new Date(fechaString);
            const opciones = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };
            return fecha.toLocaleDateString('es-ES', opciones);
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return fechaString; // Devolver la fecha original si hay error
        }
    };
    
    const mailOptions = {
        from: `"Vinculate Cee" <${emailUser}>`, // dirección del remitente
        to: destinatario, // dirección del destinatario
        subject: "CEE",
        text: "Tematicas de la asamblea : ",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50; text-align: center;">Nueva Asamblea CEE</h2>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #34495e; margin-top: 0;">Temas de la Asamblea:</h3>
                    <p style="font-size: 16px; line-height: 1.6; color: #2c3e50;">${body.Temas}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #34495e; margin-top: 0;">Sala:</h3>
                    <p style="font-size: 16px; line-height: 1.6; color: #2c3e50;">${body.Sala}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #34495e; margin-top: 0;">Fecha y Hora:</h3>
                    <p style="font-size: 16px; line-height: 1.6; color: #2c3e50;">${formatearFecha(body.Fecha)}</p>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado con exito:", info.messageId);
        return info;
    } catch (error) {
        console.log("Error al enviar el mensaje ", error);
        throw error;
    }
}

