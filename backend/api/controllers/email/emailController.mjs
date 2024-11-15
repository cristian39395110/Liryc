import nodemailer from 'nodemailer'
// const nodemailer = require('nodemailer');

// Configuración del transporter (servidor de correo)
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ruvik.solutions@gmail.com', // Tu dirección de correo electrónico
        pass: 'tech horse medusa' // Tu contraseña de correo electrónico
    }
});







// Detalles del correo electrónico
export const enviarMail = (req, res) => {
    const data = req.body;
    const plantilla = data.plantilla;
    const contactos = data.contactos;
    contactos.forEach(value => {
        let mailOptions = {
            from: 'ruvik.solutions@gmail.com', // Dirección del remitente
            to: value.mail, // Dirección del destinatario
            subject: plantilla.asunto,
            text: plantilla.texto
        };
    
        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error(error);
            } else {
                console.log('Correo electrónico enviado: ' + info.response);
            }
        });
    });
    
}
