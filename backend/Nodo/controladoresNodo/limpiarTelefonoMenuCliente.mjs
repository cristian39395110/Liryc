import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
const client = obtenerClienteDeWhatsapp(colors, false)
import con from '../../database/conexion.mjs';

export function limpiarTelefonoMenuCliente(telefono){
  if(!telefono.includes("@c.us")){
    telefono = telefono + "@c.us";
   }
   if (!telefono.startsWith('549')) {
    telefono = '549' + telefono;
  }
    let sql = "DELETE FROM menucliente WHERE telefono = '"+telefono+"'";
    con.query(sql, (err, result) => {
      if(err){
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo el limpiarTelefonoMenuCliente\n" + err
        );
        return console.log("error en limpiarTelefonoMenuCliente");
      }
    });
  }