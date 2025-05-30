import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true para 465, false para otros puertos
    auth: {
        user: "omarcatrileo20@gmail.com",
        pass: "smyf jxux xrou jhnq"
    }
});

transporter.verify((error) => {
    if (error) {
        console.error('Error al verificar el transporte:', error);
    }
});

export async function NotificarAsamblea(destinatario,body) {
    const mailOptions = {
        from: '"Vinculate Cee" omarcatrileo20@gmail.com', // dirección del remitente
        to: destinatario, // dirección del destinatario, pasada en la solicitud
        subject: "CEE",
        text: "Tematicas de la asamblea : ",
        html: `<b>Temás de la asamblea:</b> ${body.Temas}<br>
        <b>Lugar:</b> ${body.Fecha} ${body.Sala}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado con exito")
    } catch (error) {
        console.log("Error al enviar el mensaje ", error);

    }
};
