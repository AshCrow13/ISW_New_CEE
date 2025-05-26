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
    } else {
        console.log('Transporte listo para enviar correos');
    }
});

export async function NotificarAsamblea(destinatario, tematicas) {
    const mailOptions = {
        from: '"Vinculate Cee" omarcatrileo20@gmail.com', // dirección del remitente
        // to: destinatario, // dirección del destinatario, pasada en la solicitud
        to: "prozero133@gmail.com",
        subject: "CEE",
        text: "Tematicas de la asamblea : ",
        html:`<b>Tematicas de la asamblea :</b> ${tematicas}`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        handleSuccess( 201, "Email enviado correctamente", info);
    } catch (error) {
        handleErrorServer( 500, error.message);
    }
};
