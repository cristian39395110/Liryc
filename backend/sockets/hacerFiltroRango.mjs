export const hacerFiltroRango = (
  con,
  chatModoDios,
  contadorUltimoId,
  rangoUsuario,
  callback
) => {
  
  let sql = "";
  if (chatModoDios) { // si es modo dios busco todos los mensajes sin tener en cuenta los clientes activos
    sql = "SELECT m.*, c.* FROM mensajes m INNER JOIN contactos c ON c.telefono = m.telefono WHERE STR_TO_DATE(m.fechaBuscar, '%d-%m-%Y') >= DATE_FORMAT(CURDATE(), '%Y-%m-01')  AND STR_TO_DATE(m.fechaBuscar, '%d-%m-%Y') < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01') ORDER BY idMensaje DESC";
  } else if(rangoUsuario !== 'admin'){ // si no es admin, busco los mansajes de los clientes activos teniendo en cuenta el rango el operador logeado
    // sql ="SELECT * FROM mensajes m INNER JOIN clientesactivo a ON (m.telefono = a.telefono AND a.rango = '"+rangoUsuario+"') INNER JOIN contactos c ON c.telefono = a.telefono  ORDER BY idMensaje DESC";
    sql = "SELECT * FROM mensajes m INNER JOIN clientesactivo a ON (m.telefono = a.telefono AND a.rango = '"+rangoUsuario+"') INNER JOIN contactos c ON c.telefono = a.telefono WHERE STR_TO_DATE(m.fechaBuscar, '%d-%m-%Y') >= DATE_FORMAT(CURDATE(), '%Y-%m-01')  AND STR_TO_DATE(m.fechaBuscar, '%d-%m-%Y') < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01') AND m.idMensaje > '"+contadorUltimoId+"' ORDER BY idMensaje DESC";
  }else{ // si es admin busco los mensajes de los clientes activos sin tener en cuenta el rango
    // sql = "SELECT * FROM mensajes m INNER JOIN clientesactivo a ON m.telefono = a.telefono INNER JOIN contactos c ON c.telefono = a.telefono  ORDER BY idMensaje DESC";
    sql = "SELECT * FROM mensajes m INNER JOIN clientesactivo a ON m.telefono = a.telefono INNER JOIN contactos c ON c.telefono = a.telefono WHERE STR_TO_DATE(m.fechaBuscar, '%d-%m-%Y') >= DATE_FORMAT(CURDATE(), '%Y-%m-01')  AND STR_TO_DATE(m.fechaBuscar, '%d-%m-%Y') < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01') AND m.idMensaje > '"+contadorUltimoId+"' ORDER BY idMensaje DESC";
  }
  con.query(sql, function (err, result) {
    if (err) {
      // client.sendMessage(
      //   "5492664840533@c.us",
      //   "Crasheo el get /filtroRango\n" + err
      // );
      return console.log("error en hacerFiltroRango", err);
    }
   
    con.query("SELECT MAX(idMensaje) as ultimoId FROM mensajes", function(err, ultimoId){
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo el get /filtroRango\n" + err
        );
        return console.log("error en hacerFiltroRango");
      }
      
    
   // Convertir el resultado en formato JSON
    // Pasar el JSON al callback para que pueda ser utilizado por la función que llama a hacerFiltroRango
    // Objeto para almacenar los datos organizados por cliente
    const clientesConMensajes = {};
    const mensajes = result;
    let notificaciones = {};
    // Proceso para organizar los mensajes por cliente
    // console.log(result)
    mensajes.forEach((mensaje) => {
      // Verificar si el cliente ya está en el objeto, si no, se crea una entrada con un array vacío
      if (!clientesConMensajes[mensaje.telefono]) {
        if (mensaje.nuevoMensaje) {
         notificaciones = {
          "animation-name": "latir",
          "animation-duration": "2s",
          "animation-iteration-count": "infinite",
          color: "#f7a12f",
        };
      } else{
        notificaciones = {}
      }
        clientesConMensajes[mensaje.telefono] = {
          infoCliente: {
            nombre: mensaje.nombre,
            telefono: mensaje.telefono,
            rango: mensaje.rango,
            avatar: mensaje.urlPerfil,
            fecha: mensaje.fecha,
            nuevoMensaje: notificaciones,
            descripcion: mensaje.descripcion,
            direccion: mensaje.direccion,
            producto: mensaje.producto,
            codigoIspcube: mensaje.codigoIspcube,
            dni: mensaje.dni
            // Otros datos del cliente que puedan ser relevantes
          },
          mensajes: [],
        };
      }

      // Agregar el mensaje al array de mensajes del cliente correspondiente
      clientesConMensajes[mensaje.telefono].mensajes.push({
        idMensaje: mensaje.idMensaje,
        fecha: mensaje.fecha,
        mensaje: mensaje.mensaje,
        estado: mensaje.estado,
        usuario: mensaje.nombreUsuario,
        rangoUsuario: mensaje.rangoUsuario,
        imgurl: mensaje.imgurl,
        rangoMensaje: mensaje.rangoMensaje,
        // Otros datos del mensaje que puedan ser relevantes
      });

     
    });
    // Convertir el objeto a un array de objetos
    const clientesConMensajesArray = Object.values(clientesConMensajes);
    
    callback(clientesConMensajesArray, ultimoId); // ORIGINALMENTE DEVUELVO RESULTclientesConMensajesArray //ultimoId
  })
  });
};
