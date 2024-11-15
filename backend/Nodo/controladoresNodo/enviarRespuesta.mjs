import colors from 'colors/safe.js'
import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
const client = obtenerClienteDeWhatsapp(colors, false);
// Función para enviar una respuesta al cliente
export const enviarRespuesta = (telefono, respuesta) => {
    client.sendMessage(telefono, respuesta);
  };