
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({ // Configuración del transporte SMTP
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para el puerto 465
    auth: {
        user: process.env.EMAIL_USER, // Usuario de correo electrónico
        pass: process.env.EMAIL_PASS, // Contraseña de correo electrónico
    }
});

export async function enviarCorreoEstudiantes(asunto, mensajeHtml, destinatarios) {
    const mailOptions = { // Opciones del correo
        from: `"Centro de Estudiantes" <${process.env.EMAIL_USER}>`,
        to: destinatarios, // puede ser un solo email o un array
        subject: asunto,
        html: mensajeHtml,
    };

    try {
        const info = await transporter.sendMail(mailOptions); // Enviar el correo
        console.log("Correo enviado:", info.messageId); 
        return info;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw error;
    }
}

