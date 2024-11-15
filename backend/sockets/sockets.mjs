import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import con from "../database/conexion.mjs";
import { hacerFiltroRango } from "./hacerFiltroRango.mjs";


import { createAdapter } from "@socket.io/cluster-adapter";


import { setupWorker } from "@socket.io/sticky";
const app = express();
const server = createServer(app);

const io = new Server(server, {
  pingInterval: 10000, // Enviar un ping cada 10 segundos.
  // pingTimeout: 20000, // Considerar desconectado si no hay respuesta después de 20 segundos.
  // perMessageDeflate: {
  //     threshold: 1024, // Solo comprime los mensajes si superan 1KB.
  //     zlibDeflateOptions: {
  //         chunkSize: 16 * 1024,
  //         memLevel: 7,
  //         level: 6,
  //     },
  //     zlibInflateOptions: {
  //         chunkSize: 16 * 1024,
  //     },
  // },
  reconnection: true,  // Habilita la reconexión automática
  reconnectionAttempts: 5,  // Intenta 5 veces antes de fallar
  reconnectionDelay: 2000,  // Espera 2 segundos entre intentos
  cors: {
      origin: "*",
  },
});

//io.adapter(createAdapter()); //produccion
//setupWorker(io); //produccion


  // Establecer la conexión de sockets
  io.on("connection", (socket) => {
    
    // console.log('Nuevo cliente conectado')
    // Manejar eventos de desconexión del cliente
    socket.on("disconnect", () => {
      // console.log("Cliente desconectado");
    });
    // Escuchar eventos del cliente}

    socket.on('login', (rango, usuario)=>{
      // Salir de todas las rooms anteriores excepto la propia del socket
      const currentRooms = Array.from(socket.rooms).filter(room => room !== socket.id);

      currentRooms.forEach(room => {
        socket.leave(room);  // Abandonar rooms anteriores
      });

      // Verificar y unir a la room del rango si aún no está unido
      if (!socket.rooms.has(rango)) {
        socket.join(rango);
      }

      //Verificar y unir a la room del usuario si aún no está unido
      if (!socket.rooms.has(usuario)) {
        socket.join(usuario);
      }
      
      // Debug: mostrar todas las rooms a las que está unido el usuario
      console.log(`Usuario ${usuario} unido a las rooms: ${Array.from(socket.rooms)}`);
      // socket.join(rango)
      // socket.join(usuario);
      // console.log("rango", rango)
      // console.log(socket.rooms)
     });
    
    
    socket.on("getMensajes", (chatModoDios, contadorUltimoId, rangoUsuario, usuario) => {
     
      console.log('ultimoId', contadorUltimoId, rangoUsuario, usuario)
      // Aquí puedes realizar acciones con los datos recibidos del cliente
     
       if(chatModoDios){
        let roomRangoAdmin = io.sockets.adapter.rooms.get(usuario); // Obtener la room por nombre
          if (roomRangoAdmin && roomRangoAdmin.size > 0) { 
              hacerFiltroRango(con, chatModoDios, contadorUltimoId, rangoUsuario, function(data, ultimoId) {
              
                io.to(usuario).emit("mensajes", data, ultimoId);
                // Emitir eventos al cliente (si es necesario)
                // Por ejemplo, puedes enviar el JSON al cliente, hacer más operaciones con los datos, etc.
              });
          }
       }
      else{
        let roomRangoAdmin = io.sockets.adapter.rooms.get(rangoUsuario); // Obtener la room por nombre
        if (roomRangoAdmin && roomRangoAdmin.size > 0) { 
          
            hacerFiltroRango(con, chatModoDios, contadorUltimoId, rangoUsuario, function(data, ultimoId) {
              
              
            io.to(rangoUsuario).emit("mensajes", data, ultimoId);
            // Emitir eventos al cliente (si es necesario)
            // Por ejemplo, puedes enviar el JSON al cliente, hacer más operaciones con los datos, etc.
          });
        }
    }
      // O emitir eventos a todos los clientes conectados
      // io.emit('nombreDelEvento', 'Respuesta del servidor a todos los clientes')
    });
    

    // if (!socket.recovered) { // <- recuperase los mensajes sin conexión
    //   hacerFiltroRango(con, false, socket.handshake.auth.serverOffset, function (data) {
    //     // Aquí puedes trabajar con el JSON resultante
    //     io.emit("filtroRango", data.mensajes, data.lastInsertId);

    //     // Por ejemplo, puedes enviar el JSON al cliente, hacer más operaciones con los datos, etc.
    //   });
    // }
   
  });
  server.listen(5000, () => {
    console.log("Sockets escuchando en puerto 5000"); // A futuro, se puede utilizar el puerto 8081.
  });// servidor de sockets



export default io



