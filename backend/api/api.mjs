// Importación de las librerías necesarias para configurar el servidor Express.
import express from "express";
import cors from "cors";
const app = express();
// Importación de la librería 'colors' para añadir color a los mensajes de consola.
import colors from "colors/safe.js";
// Creación del servidor HTTP.
// import http from "http";
// http.createServer(app);

// Importación del módulo './sockets/sockets.mjs' para configurar sockets.
// import sockets from "./sockets/sockets.mjs";

// Configuración de middleware CORS y JSON para Express.
app.use(cors());

// Inicio del servidor en el puerto 8081.
app.listen(8081, () => {
  console.log(colors.red("Iniciando el servidor: 8081")); // A futuro, se puede utilizar el puerto 8081.
});

import login from "./routes/login/loginRoutes.mjs";
app.use("/login", login);

// Ruta '/chat' para gestionar el chat.
// import chat from "./routes/chat/chatRoutes.mjs";
// app.use("/chat", chat);

// Ruta '/contacto' para gestionar los contactos.
import contacto from "./routes/contacto/contactoRoutes.mjs";
app.use("/contacto", contacto);

// Ruta '/notificacion' para gestionar las notificaciones.
import notificacion from "./routes/notificacion/notificacionRoutes.mjs";
app.use("/notificacion", notificacion);

// Ruta '/estadisticas' para gestionar las estadísticas.
import estadisticas from "./routes/estadisticas/estadisticasRoutes.mjs";
app.use("/estadisticas", estadisticas);

// Ruta '/tickets' para gestionar los tickets.
import ticket from "./routes/tickets/ticketsRoutes.mjs";
app.use('/tickets', ticket);

import email from "./routes/email/emailRoutes.mjs"
app.use('/email', email);