import con from "../../../database/conexion.mjs"
import obtenerClienteDeWhatsapp from "../../../conexionWhatsapp/conexionW.js"
const client = obtenerClienteDeWhatsapp(null, false);

export const consultas = (req, res) =>{
    var sql = "SELECT area, consultas FROM areas";
    con.query(sql, function (err, result) {
      if (err) {
       
       client.sendMessage('5492664840533@c.us', 'Crasheo el get /consultas\n' + err);
                 return console.log("error en consultas");
      }
      res.send(result);
    });
  }
export const mensaje = (req, res) => {
    var sql = "SELECT * FROM mensajes";
    con.query(sql, function (err, result) {
      if (err) {
        
        client.sendMessage('5492664840533@c.us', 'get /mensaje\n' + err);
                  return console.log("mensaje");
      }
      res.send(result);
    });
}

export const clienteAtendido = (req, res) => {
  var sql =
    "SELECT c.urlPerfil, c.nombre, m.mensaje, a.rango, m.fecha, m.telefono FROM mensajes m INNER JOIN clientesactivo a ON m.telefono = a.telefono INNER JOIN contactos c ON m.telefono = c.telefono WHERE a.nuevoMensaje = 0 ORDER BY idMensaje DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /clienteAtendido\n" + err
      );
      return console.log("error en clienteAtendido");
    }

    res.send(result);
  });
}

export const clienteNoAtendido = (req, res) => {
  var sql =
    "SELECT c.urlPerfil, c.nombre, m.mensaje, a.rango, m.fecha, m.telefono FROM mensajes m INNER JOIN clientesactivo a ON m.telefono = a.telefono INNER JOIN contactos c ON m.telefono = c.telefono WHERE a.nuevoMensaje = 1 ORDER BY idMensaje DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /clienteNoAtendido\n" + err
      );
      return console.log("error en clienteNoAtendido");
    }
    res.send(result);
  });
}

export const buscarPorFechaDesde = (req, res) => {
  const data = req.body;
  var fechaDesde = data.fechaDesde;
  const sql = `SELECT * FROM mensajes WHERE fechaBuscar LIKE '%${fechaDesde}%'`;
  try {
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo el post /buscarPorFechaDesde\n" + err
        );
        return console.log("error en buscarPorFechaDesde");
      }
      res.send(result);
    });
  } catch (e) {
    console.log(e);
  }
}

export const buscarPorRangoDeFechas = (req, res) => {
  const data = req.body;
  var fechaDesde = data.fechaDesde;
  var fechaHasta = data.fechaHasta;
  const sql = `SELECT * FROM mensajes WHERE fechaBuscar BETWEEN '${fechaDesde}' AND '${fechaHasta}' `;
  try {
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo post /buscarPorRangoDeFechas\n" + err
        );
        return console.log("error en buscarPorRangoDeFechas");
      }
      res.send(result);
    });
  } catch (e) {
    console.log(e);
  }
}