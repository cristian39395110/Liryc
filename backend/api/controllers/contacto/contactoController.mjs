import con from "../../../database/conexion.mjs"
import obtenerClienteDeWhatsapp from "../../../conexionWhatsapp/conexionW.js"
const client = obtenerClienteDeWhatsapp(null, false);
import colors from 'colors/safe.js' //añade color a los mensajes de consola
// import io from '../../../sockets/sockets.mjs'
// import { hacerFiltroRango } from '../../../sockets/hacerFiltroRango.mjs'
export const getContactos = (req, res) => {
  console.log("getContacto")
  var aux = [];
  var sql = "SELECT * FROM contactos";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /contactos\n" + err
      );
      return console.log("error en get /contactos");
    }
    result.forEach((element) => {
      element.telefono = element.telefono.replace(/-/g, ""); // guion
      element.telefono = element.telefono.replace(/ /g, ""); // espacios
      // if(element.telefono.includes("+")){
      //   // element.telefono = element.telefono.replace("+", "");
      //   element.telefono=element.telefono;
      // }
      // else{
      //   element.telefono= "+549"+element.telefono;
      // }
      aux.push(element);
    });
    res.send(aux);
  });
};

export const guardarContacto = async (req, res) => {
  const data = req.body;
  console.log("guardar contacto", req.body.telefono);
   // Eliminar espacios, guiones y otros caracteres no numéricos
  data.telefono = data.telefono.replace(/\D/g, '');
  // // Verificar y corregir si el código de país está duplicado
  // if (data.telefono.startsWith('549')) {
  //   data.telefono = '549' + data.telefono.slice(2); // Eliminar el código de país duplicado
  // }
   // Agregar el código de país si no está presente
   if(!data.telefono.includes("@c.us")){
    data.telefono = data.telefono + "@c.us";
   }
   if (!data.telefono.startsWith('549')) {
    data.telefono = '549' + data.telefono;
  }

  // console.log(data.telefono)
  var urlPerfil = '' //await client.getProfilePicUrl(data.telefono);
  var sql =
    "INSERT INTO contactos (nombre, telefono, descripcion, direccion, dni, urlPerfil) VALUES('" +
    data.nombre +
    "','" +
    data.telefono +
    "', '" +
    data.descripcion +
    "', '" +
    data.direccion +
    "', '" + data.dni + "', '"+ urlPerfil + "' )";
  con.query(sql, function (err, result) {
    if (err) {
      // client.sendMessage(
      //   "5492664840533@c.us",
      //   "Crasheo el post /guardarContacto\n" + err + '\n' + data.telefono
      // );
      return console.log("error en post /guardarContacto");
    }
  });
 
  data.telefono = data.telefono + "@c.us";
  // console.log(data.telefono);
  var updateMensajes =
    "UPDATE mensajes SET nombre = '" +
    data.nombre +
    "', urlPerfil = '" +
    urlPerfil +
    "' WHERE telefono = '" +
    data.telefono +
    "'";
  con.query(updateMensajes, function (err, result) {
    if (err) {
      // client.sendMessage(
      //   "5492664840533@c.us",
      //   "Crasheo el post /guardarContacto\n" + err + '\n' + data.telefono
      // );
      return console.log("error en post /guardarContacto" + err + '\n' + data.telefono);
    }
    res.send(result);
  });
};

export const borrarContacto = (req, res) => {
  const data = req.body;
  var sql = "DELETE FROM contactos where idContacto='" + data.idContacto + "'";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post /borrarContacto\n" + err
      );
      return console.log("error en post /borrarContacto");
    }
    console.log(colors.yellow("contacto borrado"));
    res.send(true);
  });
};

export const editarContacto = async (req, res) => {
  const data = req.body;
  const rangoClienteActivo = data.rangoClienteActivo;
  // console.log(data);
  if(!data.telefono.includes("@c.us")){
    data.telefono = data.telefono + "@c.us";
   }
   if (!data.telefono.startsWith('549')) {
    data.telefono = '549' + data.telefono;
  }
  var urlPerfil = '' //await client.getProfilePicUrl(data.telefono);
  var sql =
    "UPDATE contactos SET nombre = '" +
    data.nombre +
    "', telefono='" +
    data.telefono +
    "', descripcion = '" +
    data.descripcion +
    "', direccion = '" +
    data.direccion +
    "', urlPerfil='" +
    urlPerfil +
    "', dni='" +
    data.dni +
    "' WHERE idContacto = '" +
    data.idContacto +
    "'";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post /editarContacto\n" + err
      );
      return console.log("error en post /editarContacto");
    }
    console.log(colors.yellow("contacto Actualizado", result));
    // let sqlMensaje = "UPDATE mensajes SET nombre = '"+data.nombre+"', urlPerfil = '"+urlPerfil+"' WHERE telefono = '"+data.telefono+"'";
    // con.query(sqlMensaje, function(err, result){
      
     
    // });
     res.send(true);
  //   if(rangoClienteActivo !== 'admin'){
  //     hacerFiltroRango(con, false, '', rangoClienteActivo, function (data, ultimoId) {
  //   //  console.log(rangoClienteActivo)
  //     io.to(rangoClienteActivo).emit("mensajes", data, ultimoId);
     
  //   });
  // }
  // hacerFiltroRango(con, false, '', 'admin' , function (data, ultimoId) {
   
  //   io.to('admin').emit("mensajes", data, ultimoId);
   
  // });
  });
};

