import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
const client = obtenerClienteDeWhatsapp(colors, false)
import { getRandomInt } from "../controladoresNodo/getRandomint.mjs";
export const respuestaNoEncontrada = (telefono, contact) => {
    var random = getRandomInt(5);
    if (random == 0) {
      client.sendMessage(
        telefono,
        `¡Hola ${contact.pushname}! Soy Medusa` +
          "\n" +
          "Escribí: *_HOLA_* para interactuar conmigo"
      );
    } else if (random == 1) {
      client.sendMessage(
        telefono,
        "¡Hola! 👋 Soy Medusa y estoy para ayudarte" +
          "\n" +
          "Por favor ingresa *_HOLA_* para que pueda derivarte al área que necesitas"
      );
    } else if (random == 2) {
      client.sendMessage(
        telefono,
        `Hola ${contact.pushname} 👋 Soy Medusa. Lamentablemente, no comprendo tu mensaje. Para comenzar nuestra interacción, te invito a escribir la palabra *_HOLA_*. Estoy aquí para brindarte toda la ayuda que necesites.`
      );
    } else if (random == 3) {
      client.sendMessage(
        telefono,
        `Hola ${contact.pushname} 👋 Soy Medusa. No puedo entender tu mensaje. Te sugiero iniciar nuestra conversación con un cordial *_HOLA_*. Estoy aquí para brindarte la información y ayuda que necesites.`
      );
    } else if (random == 4) {
      client.sendMessage(
        telefono,
        `Hola ${contact.pushname} 👋 Soy Medusa. Parece que tu mensaje no es claro para mí en este momento. Para comenzar, te invito a escribir *_HOLA_* y así podremos iniciar nuestra interacción. Estoy aquí para asistirte en todo lo que necesites.`
      );
    } else if (random == 5) {
      client.sendMessage(
        telefono,
        `Hola ${contact.pushname} 👋 Soy Medusa. Parece que el mensaje que has enviado no puedo entenderlo en este momento. Te invito a iniciar nuestra conversación con un amigable *_HOLA_*. Estoy lista para asistirte en todo lo que necesites.`
      );
    } else if (random == 6) {
      client.sendMessage(
        telefono,
        `Hola ${contact.pushname} 👋 soy Medusa. No logro comprender la consulta que has enviado en este instante. Te invito a iniciar nuestra interacción con un cordial *_HOLA_*. Estoy aquí para brindarte la asistencia requerida.`
      );
    }
    console.log("mensaje default");
    }