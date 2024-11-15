//*********************LLAMADAS A LIBRERIAS*******************/

// Importación de la librería 'colors' para añadir color a los mensajes de consola.
import colors from "colors/safe.js";

// // Importación de las librerías necesarias para configurar el servidor Express.
import express from "express";
import cors from "cors";

// Importación del módulo 'db' desde el archivo './database/db.mjs'.
import db from "./database/db.mjs";

// Creación de una instancia de Express y configuración del servidor.
const con = db(colors);
const app = express();

// // Creación del servidor HTTP.
// // import http from "http";
// // http.createServer(app);

// // Importación del módulo './sockets/sockets.mjs' para configurar sockets.
// // import sockets from "./sockets/sockets.mjs";

// // Configuración de middleware CORS y JSON para Express.
app.use(cors());

// Inicio del servidor en el puerto 8081.
app.listen(8082, () => {
  console.log(colors.red("Iniciando el servidor: 8082")); // A futuro, se puede utilizar el puerto 8081.
});

// Importación del módulo 'obtenerClienteDeWhatsapp' desde './conexionWhatsapp/conexionW.js'.
import obtenerClienteDeWhatsapp from "./conexionWhatsapp/conexionW.js";

// Creación del cliente de WhatsApp.
const client = obtenerClienteDeWhatsapp(colors, true);

// ************************ CONTROLADORAS ************************

// Importación de controladores y configuración de tareas periódicas.
// import despertar from "./controladores/despertar.mjs";
// import mostrarHoraActual from "./controladores/mostrarHoraActual.mjs";
import removeAccents from "./controladores/removeAccents.mjs";
// import { controlDeHorarios } from "./controladores/controlDeHorarios.mjs";
// import consultarNotify from "./controladores/consultarNotify.mjs"
//Tareas periódicas programadas.
// setInterval(() => {
//   despertar(con);
//   mostrarHoraActual(colors);
// }, 150000);

// const interval = setInterval(() => {
//   // controlDeHorarios(interval);
//   //  consultarNotify(con, client);
// }, 120000);



// import { rutinaBuscaForoPerfil } from "./controladores/rutinaBuscaFotoPerfil.mjs";
// setTimeout(() => {
//   rutinaBuscaForoPerfil(client);
// }, 10000);

// ************************ RUTAS ************************

// Ruta '/login' para gestionar el inicio de sesión.
// import login from "./api/routes/login/loginRoutes.mjs";
// app.use("/login", login);

// Ruta '/chat' para gestionar el chat.
import chat from "./api/routes/chat/chatRoutes.mjs";
app.use("/chat", chat);

// // Ruta '/contacto' para gestionar los contactos.
// import contacto from "./api/routes/contacto/contactoRoutes.mjs";
// app.use("/contacto", contacto);

// // Ruta '/notificacion' para gestionar las notificaciones.
// import notificacion from "./api/routes/notificacion/notificacionRoutes.mjs";
// app.use("/notificacion", notificacion);

// // Ruta '/estadisticas' para gestionar las estadísticas.
// import estadisticas from "./api/routes/estadisticas/estadisticasRoutes.mjs";
// app.use("/estadisticas", estadisticas);

// // Ruta '/tickets' para gestionar los tickets.
// import ticket from "./api/routes/tickets/ticketsRoutes.mjs";
// app.use('/tickets', ticket);

// import email from "./api/routes/email/emailRoutes.mjs"
// app.use('/email', email);
// ************************ WSP BOT ************************


// Manejo de mensajes de WhatsApp.
import { gestionMensajes } from "./Nodo/controladoresNodo/gestionMensajes.mjs";
client.on("message", async (message) => {
  if (message.from === "status@broadcast" || message.from.includes("@g.us")) {
    // console.log("historia de wsp");
  } else {
    var msj = message.body;
    msj = msj.toLowerCase();
    msj = removeAccents(msj);
    msj = msj.replace(/'/g, "");
    msj = msj.replace(/"/g, "");
    msj = msj.replace(/\\/g, "");
    
    // Llamada a la función 'gestionMensajes' para procesar los mensajes.
    // if(message.from === '5492664840533@c.us'){
      // console.log("entra en el filtro de numero de empresas")
      if(message.from !== '5492657497079@c.us' || message.from !== '5492657@c.us'){
        await gestionMensajes(message, msj, message.from, client);
      }
      
    // }
     
  }
});
