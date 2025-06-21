
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    }
});

export async function enviarCorreoEstudiantes(asunto, mensajeHtml, destinatarios) {
    const mailOptions = {
        from: `"Centro de Estudiantes" <${process.env.EMAIL_USER}>`,
        to: destinatarios, // puede ser un solo email o un array
        subject: asunto,
        html: mensajeHtml,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw error;
    }
}

