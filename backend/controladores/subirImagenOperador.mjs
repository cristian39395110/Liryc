import obtenerClienteDeWhatsapp from '../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
const client = obtenerClienteDeWhatsapp(colors, false)
const MessageMedia = obtenerClienteDeWhatsapp(colors, "subirImagen")
import fs from 'fs';
export default (telefono, uriUpload) => {
    const filePath = './subir/' + uriUpload;

    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Si el archivo no existe, maneja el error
            return console.log(`El archivo no existe: ${filePath}`);
        }

        // Si el archivo existe, lo envías
        try {
            const media = MessageMedia.fromFilePath(filePath);
            client.sendMessage(telefono, media);
        } catch (error) {
            console.log(error);
        }
    });
};