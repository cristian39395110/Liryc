import con from "../../../database/conexion.mjs";
import insertDataMensaje from "../../../controladores/insertDataMensaje.mjs";
import obtenerClienteDeWhatsapp from "../../../conexionWhatsapp/conexionW.js";
const client = obtenerClienteDeWhatsapp(null, false);
import comprobarContacto from "../../../controladores/comprobarContacto.mjs";
import insertCantConsultas from "../../../controladores/insertCantConsultas.mjs";
import { guardarArchivo } from "../../../controladores/guardarArchivo.mjs";
import colors from "colors/safe.js"; //añade color a los mensajes de consola
import io from '../../../sockets/sockets.mjs'
import { hacerFiltroRango } from '../../../sockets/hacerFiltroRango.mjs'


export const mensajeMedusa = (req, res) => {
  const mensaje = req.body;
  const estado = mensaje.estado;
  const ultimoId = mensaje.ultimoId;
  insertDataMensaje(mensaje, estado, mensaje.rango, '', mensaje.rangoClienteActivo, true, ultimoId);
  res.send(true);
};

export const cerrarChat = (req, res) => {
  // console.log("el operador ha finalizado el chat", req.body.telefono, req.body.rangoPrevio, req.body.rangoUsuario);
  var sql =
    "DELETE FROM clientesactivo WHERE telefono = '" + req.body.telefono + "'";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post /cerrarChat\n" + err
      );
      return console.log("error en post /cerrarChat");
    }
    if(req.body.rangoUsuario === 'admin'){
      let roomRangoRangoPrevio = io.sockets.adapter.rooms.get(req.body.rangoPrevio); // Obtener la room por nombre
      if (roomRangoRangoPrevio && roomRangoRangoPrevio.size > 0) { 
        hacerFiltroRango(con, false, req.body.ultimoId, req.body.rangoPrevio, function (data, ultimoId) {
          // Aquí puedes trabajar con el JSON resultante
          io.to(req.body.rangoPrevio).emit("mensajes", data, ultimoId);
          io.to(req.body.rangoPrevio).emit("eliminarCliente", data);
          // Por ejemplo, puedes enviar el JSON al cliente, hacer más operaciones con los datos, etc.
        });
      }
      let roomRangoAdmin = io.sockets.adapter.rooms.get('admin'); // Obtener la room por nombre
      if (roomRangoAdmin && roomRangoAdmin.size > 0) { 
        hacerFiltroRango(con, false, req.body.ultimoId, 'admin', function (data, ultimoId) {
          // Aquí puedes trabajar con el JSON resultante
          io.to('admin').emit("mensajes", data, ultimoId);
          io.to('admin').emit("eliminarCliente", data);
          // Por ejemplo, puedes enviar el JSON al cliente, hacer más operaciones con los datos, etc.
        
        });
      }
    }else{
      let roomRangoRangoUsuario = io.sockets.adapter.rooms.get(req.body.rangoUsuario); // Obtener la room por nombre
      if (roomRangoRangoUsuario && roomRangoRangoUsuario.size > 0) { 
        hacerFiltroRango(con, false, req.body.ultimoId, req.body.rangoUsuario, function (data, ultimoId) {
          // Aquí puedes trabajar con el JSON resultante
          io.to(req.body.rangoUsuario).emit("mensajes", data, ultimoId);
          io.to(req.body.rangoUsuario).emit("eliminarCliente", data);
          // Por ejemplo, puedes enviar el JSON al cliente, hacer más operaciones con los datos, etc.
        });
      }
    let roomRangoAdmin = io.sockets.adapter.rooms.get('admin'); // Obtener la room por nombre
      if (roomRangoAdmin && roomRangoAdmin.size > 0) { 
        hacerFiltroRango(con, false, req.body.ultimoId, 'admin', function (data, ultimoId) {
          // Aquí puedes trabajar con el JSON resultante
          io.to('admin').emit("mensajes", data, ultimoId);
          io.to('admin').emit("eliminarCliente", data);
          // Por ejemplo, puedes enviar el JSON al cliente, hacer más operaciones con los datos, etc.
        
        });
      }
  }
  });
  
client.sendMessage(req.body.telefono,
`*_El operador ha finalizado el chat._*

*_¡Gracias por comunicarte con nosotros!_*
*_Si tienes alguna otra consulta o necesitas más ayuda, no dudes en contactarnos nuevamente_*
*_¡Que tengas un excelente día!_*`);
    
  res.send(true);
};

export const contactoActivo = (req, res) => {
  var formattedTime = new Date().getTime();
  const data = req.body;
  const nombre = data.nombre;
  const telefono = data.numero;
  const rangoPrevio = data.rangoPrevio;
  const rangoPosterior = data.rangoPosterior;
  const fecha = data.fecha;
  const fechaBuscar = data.fechaBuscar;
  const nombreUsuario = data.nombreUsuario;
  const rangoUsuario = data.rangoUsuario;
  const ultimoId = data.ultimoId;
  var msj = "Inicio de la conversación";
  var dispositivo = "bot";
  comprobarContacto(
    telefono,
    nombre,
    fecha,
    fechaBuscar,
    msj,
    dispositivo,
    rangoPrevio,
    formattedTime,
    nombreUsuario,
    client,
    rangoPosterior,
    rangoUsuario, 
    ultimoId
  );
  res.send(true)
};

export const cambiarRangoCliente = (req, res) => {
  const data = req.body;
  const telefono = data.telefono;
  const rangoPrevio = data.rangoPrevio;
  const urlPerfil = data.urlPerfil;
  var formattedTime = new Date().getTime();
  const nombre = data.nombre;
  const rangoPosterior = data.rangoPosterior;
  const fecha = data.fecha;
  const fechaBuscar = data.fechaBuscar;
  const nombreUsuario = data.nombreUsuario;
  const msj = data.mensaje;
  const dispositivo = data.dispositivo;
  const rangoUsuario = data.rangoUsuario;
  const ultimoId = data.ultimoId;
  client.sendMessage(
    telefono,
    "Usted fue derivado con otro operador por favor aguarde en linea y en instantes sera atendido"
  );
  comprobarContacto(
    telefono,
    nombre,
    fecha,
    fechaBuscar,
    msj,
    dispositivo,
    rangoPrevio,
    formattedTime,
    nombreUsuario,
    client,
    rangoPosterior,
    rangoUsuario,
    ultimoId
  );
  res.send(true)
};

export const empleados = (req, res) => {
  var sql = "SELECT nombre, rango, telefono FROM users";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /empleados\n" + err
      );
      return console.log("error en empleados");
    }
    res.send(result);
  });
};

export const filtroRangoDios = (req, res) => {
  // var sql = "SELECT m.*,c.idClienteActivo, c.rango, c.Fecha, c.bool, c.fechaMensaje, c.nuevoMensaje FROM mensajes m INNER JOIN clientesactivo c WHERE m.telefono NOT LIKE '%g.us%' ORDER BY idMensaje DESC";
  var sql =
    "SELECT m.* FROM mensajes m WHERE m.telefono NOT LIKE '%g.us%' ORDER BY idMensaje DESC";
  // INNER JOIN  ORDER BY idMensaje DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /filtroRangoDios\n" + err
      );
      return console.log("filtroRangoDios");
    }
    res.send(result);
  });
};

export const guardar = (req, res) => {
  const data = req.body;
  const ruta = data.ruta;
  const archivo = data.archivo;
  const nombre = data.nombre;

  guardarArchivo(ruta, archivo, nombre);
};

export const offNuevoMensaje = (req, res) => {
  const data = req.body;
  const telefono = data.telefono;
  var sql =
    "UPDATE clientesactivo SET nuevoMensaje = '" +
    0 +
    "' WHERE telefono = '" +
    telefono +
    "'";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post /offNuevoMensaje\n" + err
      );
      return console.log("error en offNuevoMensaje");
    }
  });
};

export const chatMensajes = (req, res) => {
  var sql =
    "SELECT * FROM mensajes m INNER JOIN clientesactivo a ON m.telefono = a.telefono ORDER BY idMensaje DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post /offNuevoMensaje\n" + err
      );
      return console.log("error en chatMensajes");
    }
    // Objeto para almacenar los datos organizados por cliente
    const clientesConMensajes = {};
    const mensajes = result;
    // Proceso para organizar los mensajes por cliente
    // console.log(mensajes);
    mensajes.forEach((mensaje) => {
      // Verificar si el cliente ya está en el objeto, si no, se crea una entrada con un array vacío
      if (!clientesConMensajes[mensaje.telefono]) {
        clientesConMensajes[mensaje.telefono] = {
          infoCliente: {
            nombre: mensaje.nombre,
            telefono: mensaje.telefono.replace('@c.us', ''),
            rango: mensaje.rango,
            avatar: mensaje.urlPerfil,

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
        
        // Otros datos del mensaje que puedan ser relevantes
      });
    });

    // Convertir el objeto a un array de objetos
    const clientesConMensajesArray = Object.values(clientesConMensajes);
    res.send(clientesConMensajesArray);
  });
};

import axios from "axios";
export const getCliente = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/getCliente';
    const data = {
        documento: req.body.documento |  null,
    };
    // console.log(data, "antes de enviar")
    axios.post(url, data)
    .then(response => {
      res.send(response.data)
    });
}

export const verConexion = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/verConexion';
    const data = {
        documento: req.body.documento |  null,
    };
    // console.log(data, "antes de enviar")
    axios.post(url, data)
    .then(response => {
      res.send(response.data)
    });
}

export const getFactura6 = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/getFactura6';
    const data = {
        documento: req.body.documento |  null,
    };
    // console.log(data, "antes de enviar")
    axios.post(url, data)
    .then(response => {
      res.send(response.data)
    });
}

export const refrecarContactos = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/refrecarContactos';
    const data = {
        documento: req.body.documento |  null,
    };
    // console.log(data, "antes de enviar")
    axios.post(url, data)
    .then(response => {
      res.send(response.data)
    });
}

export const verTicket = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/verTicket';
    const data = {
        documento: req.body.documento |  null,
    };
    // console.log(data, "antes de enviar")
    axios.post(url, data)
    .then(response => {
      res.send(response.data)
    });
}

export const getCategoriaTickets = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/getCategoriaTickets';
    // console.log(data, "antes de enviar")
    axios.get(url)
    .then(response => {
      res.send(response.data)
    });
}

export const estadoTickets = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/estadoTickets';
    // console.log(data, "antes de enviar")
    axios.get(url)
    .then(response => {
      res.send(response.data)
    });
}

export const areasTickets = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/areasTickets';
    // console.log(data, "antes de enviar")
    axios.get(url)
    .then(response => {
      res.send(response.data)
    });
}

export const insertTicket = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/insertTicket';
    const data = {
        documento: req.body.documento |  null,
    };
    // console.log(data, "antes de enviar")
    axios.post(url, data)
    .then(response => {
      res.send(response.data)
    });
}

export const updateTicket = (req, res) => {
  
  const url = 'http://172.19.3.85:5034/updateTicket';
    const data = {
        documento: req.body.documento |  null,
    };
    // console.log(data, "antes de enviar")
    axios.post(url, data)
    .then(response => {
      res.send(response.data)
    });
}

