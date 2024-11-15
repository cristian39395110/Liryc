import { enviarRespuesta } from "./enviarRespuesta.mjs";
// Función para manejar errores y enviar un mensaje de error al cliente
export const manejarError = (error) => {
    console.error("Error:", error);
    const mensajeError = "Lo siento, se produjo un error en el bot. Por favor, inténtalo nuevamente más tarde.";
    enviarRespuesta(mensajeError);
  };  