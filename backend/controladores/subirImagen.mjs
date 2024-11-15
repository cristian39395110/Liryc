import colors from 'colors/safe.js'
import obtenerClienteDeWhatsapp from '../conexionWhatsapp/conexionW.js'
const client = obtenerClienteDeWhatsapp(colors, false);
export const subirImagen = (telefono, uriUpload) => {
    const media = MessageMedia.fromFilePath('./publi/'+uriUpload);
    client.sendMessage(telefono, media);
}