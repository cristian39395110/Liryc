import network from 'network'
import con from '../../../database/conexion.mjs'
import obtenerClienteDeWhatsapp from "../../../conexionWhatsapp/conexionW.js";
const client = obtenerClienteDeWhatsapp(null, false);
export const  login = async (req, res) => {
    var macAdd = "";
    // network.get_active_interface(function(err, obj) {
     
      //  macAdd = obj.mac_address;
    
      const { usuario, contrasena } = req.body;
      console.log("logueando:", usuario, contrasena);
      // var sql = "SELECT * FROM users WHERE usuario = '"+usuario+"' AND pass = '"+contrasena+"' AND (estado='' OR estado='"+macAdd+"')";
      var sql = "SELECT * FROM users WHERE usuario = '"+usuario+"' AND pass = '"+contrasena+"'";
      con.query(sql, function (err, result) {
        if (err){
          
          client.sendMessage('5492664840533@c.us', 'Crasheo el post /login\n' + err);
          return console.log("error en post /login");
        }
        // console.log(result.status);
        if(result.length > 0){
          // console.log(result)
          res.send(result);
          var sqlInsert = "UPDATE users SET estado = 1 WHERE usuario = '"+usuario+"' AND pass = '"+contrasena+"'";
          con.query(sqlInsert, function(err, result){
            if(err){
              return console.log("Login");
            }
          });
        }else{
          res.send(result);
        }
      });
    // });
  }

export const cerrarSesion = (req, res) => {
  var nombre=""
  const data = req.body;
  nombre = data.nombre;
  // console.log(nombre);
  var sql = "UPDATE users SET estado = '-1' WHERE nombre = '"+nombre+"'";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /cerrarSesion\n' + err);
      return console.log("error en post /cerrarSesion");
    }
    res.send(true);
  });
}
