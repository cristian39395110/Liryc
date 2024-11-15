import obtenerClienteDeWhatsapp from '../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
const client = obtenerClienteDeWhatsapp(colors, false)
import con from '../database/conexion.mjs'
import insertCantConsultas from './insertCantConsultas.mjs'
import io from '../sockets/sockets.mjs'
import { hacerFiltroRango } from '../sockets/hacerFiltroRango.mjs'
export const comprobarTelefono = async (telefono, rangoDb, mensaje) => {
    var urlPerfil = await client.getProfilePicUrl(telefono);
    var formattedTime= new Date().getTime();
    var exiteUsuario = "SELECT telefono FROM clientesactivo WHERE telefono = '"+telefono+"'";
    con.query(exiteUsuario, function (err, result) {
      if (err) {
        
        client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarTelefono\n' + err);
              return console.log("error en comprobarTelefono");
      }
      if(result.length > 0  ){
        insertCantConsultas(rangoDb, client, con);
        // console.log(colors.yellow("usuario existe"));
        var sql="UPDATE clientesactivo SET rango = '"+rangoDb+"', Fecha='"+formattedTime+"', bool='"+1+"', fechaMensaje='"+formattedTime+"',nuevoMensaje='"+1+"' WHERE telefono = '"+telefono+"'";
        con.query(sql, function (err, result) {
          if (err) {
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarTelefono\n' + err);
              return console.log("error en comprobarTelefono");
          }
          // console.log("1 record updated");
        });
      }else{
        insertCantConsultas(rangoDb, client, con);
        // console.log(colors.yellow("usuario no existe en comprobarTelefono"));         
        var sql = "INSERT INTO clientesactivo (telefono, rango, Fecha, bool, fechaMensaje, nuevoMensaje) VALUES('"+telefono+"','"+rangoDb+"','"+formattedTime+"','"+0+"','"+formattedTime+"','"+1+"')";
        con.query(sql, function (err, result) {
          if (err) {
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarTelefono\n' + err);
              return console.log("error en comprobarTelefono");
          }
          let roomRangoRangoDb = io.sockets.adapter.rooms.get(rangoDb); // Obtener la room por nombre
          if (roomRangoRangoDb && roomRangoRangoDb.size > 0) { 
            hacerFiltroRango(con, false, '', rangoDb, function (data, ultimoId) {
                io.to(rangoDb).emit("mensajes", data, ultimoId);
            });
          }
          let roomRangoAdmin = io.sockets.adapter.rooms.get('admin'); // Obtener la room por nombre
          if (roomRangoAdmin && roomRangoAdmin.size > 0) { 
            hacerFiltroRango(con, false, '', 'admin', function (data, ultimoId) {
                io.to('admin').emit("mensajes", data, ultimoId);
            });
          }
        });
      }
    });       
}