import con from "../../database/conexion.mjs";
import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
const client = obtenerClienteDeWhatsapp(colors, false)
export function guardarNodoActual(telefono, menu, numero, datos, opcion, instancia, menuFinal, otros){
    var sql = "SELECT * FROM menucliente WHERE telefono = '" + telefono + "'";
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo el existeClienteEnMenu\n" + err
        );
        return console.log("error en existeClienteEnMenu");
      }
      if (result.length > 0) {
        let sql =
          "UPDATE menucliente SET menu = '" + menu + "', numero = '"+ numero +"' , datos = '"+ datos +"', opcion = '"+ opcion +"', instancia = '"+ instancia +"', menuFinal = '"+menuFinal+"', otros = '"+otros+"' WHERE telefono = '" + telefono + "'";
        con.query(sql, (err, result) => {
          if (err) {
            client.sendMessage(
              "5492664840533@c.us",
              "Crasheo el guardarMenuSeleccionado\n" + err
            );
            return console.log("error en guardarMenuSeleccionado");
          }
        });
      } else {
        let sql =
          "INSERT INTO menucliente (telefono, menu, numero) VALUES('" +
          telefono +
          "', '" +
          menu +
          "', '" +
          numero +
          "')";
        con.query(sql, (err, result) => {
          if (err) {
            client.sendMessage(
              "5492664840533@c.us",
              "Crasheo el guardarMenuSeleccionado\n" + err
            );
            return console.log("error en guardarMenuSeleccionado");
          }
        });
      }
    });
  }