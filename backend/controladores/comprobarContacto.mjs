import con from "../database/conexion.mjs"
import insertCantConsultas from './insertCantConsultas.mjs'
import colors from 'colors/safe.js' //añade color a los mensajes de consola
import io from '../sockets/sockets.mjs'
import { hacerFiltroRango } from '../sockets/hacerFiltroRango.mjs'
export default async (telefono, nombre, fecha,fechaBuscar, msj, dispositivo, rangoPrevio, formattedTime, nombreUsuario, client,rangoPosterior, rangoMensaje, ultimoId) => {
    // console.log(msj, nombreUsuario, "mensaje")
    var formattedTime= new Date().getTime();
    telefono = telefono.replace('+', '');
    // Verifica si el número de teléfono no contiene '@c.us' al final
    if (!telefono.endsWith('@c.us')) {
      // Agrega '@c.us' al final del número de teléfono
      telefono += '@c.us';
    }
    var urlPerfil = await client.getProfilePicUrl(telefono);
    var exiteUsuario = "SELECT telefono FROM clientesactivo WHERE telefono = '"+telefono+"'";
    con.query(exiteUsuario, function (err, result) {
      if (err) {
        client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarContacto\n' + err);
        return console.log("error en comprobarContacto");
      }
      if(result.length <= 0 ){ 
        
               
          var sql = "INSERT INTO clientesactivo (telefono, rango, Fecha, bool, fechaMensaje, nuevoMensaje) VALUES('"+telefono+"','"+rangoPrevio+"','"+formattedTime+"','"+0+"','"+formattedTime+"','"+0+"')";
          con.query(sql, function (err, result) {
            if (err) {
              client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarContacto\n' + err);
              return console.log("error en comprobarContacto");
            }
        });
      }else{
        // console.log(colors.yellow("usuario si existe"));         
        var sql="UPDATE clientesactivo SET rango = '"+rangoPrevio+"', Fecha='"+formattedTime+"', bool='"+1+"', fechaMensaje='"+formattedTime+"',nuevoMensaje='"+1+"' WHERE telefono = '"+telefono+"'";
          con.query(sql, function (err, result) {
            if (err) {
              client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarContacto\n' + err);
              return console.log("error en comprobarContacto");
            }
        });
      }
      insertCantConsultas(rangoPrevio, client, con);
      
      var sql = "INSERT INTO mensajes (nombre, telefono, fecha, fechaBuscar, mensaje, dispositivo, imgurl, estado, rangoMensaje, urlPerfil, nombreUsuario) VALUES('"+nombre+"','"+telefono+"','"+fecha+"','"+fechaBuscar+"','"+msj+"','"+dispositivo+"','"+''+"','"+0+"','"+rangoPrevio+"', '"+urlPerfil+"','"+nombreUsuario+"')";
      con.query(sql, function (err, result) {
        if (err) {
          client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarContacto\n' + err);
            return console.log("error en comprobarContacto");
        }
        
         let roomRangoPrevio = io.sockets.adapter.rooms.get(rangoPrevio); // Obtener la room por nombre
          if (roomRangoPrevio && roomRangoPrevio.size > 0) { 
            // Si la room existe y tiene al menos un cliente conectado
            // Verificar si la room tiene clientes antes de emitir el evento
            hacerFiltroRango(con, false, ultimoId, rangoPrevio, function (data, ultimoId) {
              
                io.to(rangoPrevio).emit("mensajes", data, ultimoId);
                io.to(rangoPosterior).emit("eliminarCliente", data);
            });
          }
          let roomRangoPosterior = io.sockets.adapter.rooms.get(rangoPosterior); // Obtener la room por nombre
            if (roomRangoPosterior && roomRangoPosterior.size > 0) { 
              hacerFiltroRango(con, false, ultimoId, rangoPosterior, function (data, ultimoId) {
                  io.to(rangoPosterior).emit("mensajes", data, ultimoId);
                  io.to(rangoPosterior).emit("eliminarCliente", data);
              });
            }
            let roomAdmin = io.sockets.adapter.rooms.get('admin'); // Obtener la room por nombre
            if (roomAdmin && roomAdmin.size > 0) { 
              hacerFiltroRango(con, false, ultimoId, 'admin', function (data, ultimoId) {
                  io.to('admin').emit("mensajes", data, ultimoId);
                  io.to('admin').emit("eliminarCliente", data);
              });
          }
      });
    });
}