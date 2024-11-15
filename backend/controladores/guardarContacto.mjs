import con from "../database/conexion.mjs";
export const guardarContacto = async (nombre, telefono, urlPerfil, client) => {
    if(nombre !== undefined){
        nombre = nombre.replace(/'/g, "");
        nombre = nombre.replace(/"/g, "");
        nombre = nombre.replace(/\\/g, "");
        nombre = nombre.replace(/\?/g, "");
      }
      var sql = "SELECT telefono FROM contactos WHERE telefono = '"+telefono+"'";
      con.query(sql, function (err, result) {
        if (err){
          // client.sendMessage('5492664840533@c.us', 'Crasheo el post /guardarContacto\n' + err);
          return console.log("error en post /guardarContacto" + '\n' + telefono);
        }
        if(result.length <= 0){ // SI EL CONCTACTO NO ESTA GUARDADO, LO GUARDAMOS EN CONTACOS
          var sql = "INSERT INTO contactos (nombre, telefono, urlPerfil) VALUES('"+nombre+"','"+telefono+"', '"+urlPerfil+"')";
          con.query(sql, function (err, result) {
            if (err){
              client.sendMessage('5492664840533@c.us', 'Crasheo el post /guardarContacto\n' + err  + '\n' + telefono);
              return console.log("error en post /guardarContacto" + '\n' + telefono);
            }
          });
        }else{ //SI EL CONTACTO YA ESTA GUARDADO ENTONCES, ACTUALIZO SU FOTO DE PERFIL POR SI LA CAMBIA LA PERSONA O WSP
          var sql = "UPDATE contactos SET urlPerfil = '"+urlPerfil+"' WHERE telefono = '"+telefono+"'";
          con.query(sql, function (err, result) {
            if (err){
              client.sendMessage('5492664840533@c.us', 'Crasheo el post /guardarContacto\n' + err  + '\n' + telefono);
              return console.log("error en post /guardarContacto"  + '\n' + telefono);
            }
          });
        }
       
      });
}