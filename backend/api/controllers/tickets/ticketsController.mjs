import con from "../../../database/conexion.mjs";
import obtenerClienteDeWhatsapp from "../../../conexionWhatsapp/conexionW.js";
const client = obtenerClienteDeWhatsapp(null, false);

export const ticket = (req, res) => {
  var sql =
    "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto ORDER BY t.fechaCreacion DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /tickets\n" + err
      );
      return console.log("error en tickets");
    }
    res.send(result);
  });
};

export const deleteTickets = (req, res) => {
  const data = req.body;
  var sql = "DELETE FROM tickets WHERE idTicket = '" + data.idTicket + "'";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /tickets\n" + err
      );
      return console.log("error en tickets");
    }
    res.send(true);
  });
};

export const ticketsOperador = (req, res) => {
  const data = req.body;
  var sql =
    "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.usuario = '" +
    data.usuario +
    "' ORDER BY t.fechaCreacion DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /tickets\n" + err
      );
      return console.log("error en tickets");
    }
    res.send(result);
  });
};

export const ticketAsignadosPorOperador = (req, res) => {
    const data = req.body;
  var sql =
    "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.asignado = '" +
    data.usuario +
    "' ORDER BY t.fechaCreacion DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /tickets\n" + err
      );
      return console.log("error en tickets");
    }
    res.send(result);
  });
}

export const ticketAsignadosPorOperadorProceso = (req, res) => {
    const data = req.body;
  var sql =
    "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.asignado = '" +
    data.usuario +
    "' AND t.estado = 'en proceso' ORDER BY t.fechaCreacion DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /tickets\n" + err
      );
      return console.log("error en tickets");
    }
    res.send(result);
  });
}

export const ticketAsignadosPorOperadorAbiertos = (req, res) => {
    const data = req.body;
  var sql =
    "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.asignado = '" +
    data.usuario +
    "' AND t.estado = 'abierto' ORDER BY t.fechaCreacion DESC";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /tickets\n" + err
      );
      return console.log("error en tickets");
    }
    res.send(result);
  });
}

export const ticketAsignadosPorOperadorCerrados = (req, res) => {
    const data = req.body;
    var sql =
      "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.asignado = '" +
      data.usuario +
      "' AND t.estado = 'cerrado' ORDER BY t.fechaCreacion DESC";
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo el get /tickets\n" + err
        );
        return console.log("error en tickets");
      }
      res.send(result);
    });
}

export const insertTicket = (req, res) => {
    const data = req.body;
    const idContacto = data.idContacto;
    const categoria = data.categoria;
    const asignado = data.asignado;
    const descripcion = data.descripcion;
    const estado = data.estado;
    const prioridad = data.priorirdad;
    const comentario = data.comentario;
    const usuario = data.usuario;
    const fechaCreacion = data.fechaCreacion;
    const fechaProceso = data.fechaProceso;
    const area = data.area;
    const fechaCierre = data.fechaCierre;
  
    var sql =
      "INSERT INTO tickets (idContacto, categoria, asignado, descripcionTicket, estado, prioridad, comentario, usuario, fechaCreacion, fechaProceso, area, fechaCierre) VALUES('" +
      idContacto +
      "','" +
      categoria +
      "','" +
      asignado +
      "', '" +
      descripcion +
      "', '" +
      estado +
      "', '" +
      prioridad +
      "', '" +
      comentario +
      "', '" +
      usuario +
      "', '" +
      fechaCreacion +
      "', '" +
      fechaProceso +
      "', '" +
      area +
      "', '" +
      fechaCierre +
      "')";
    con.query(sql, function (err, result) {
      if (err) {
        // client.sendMessage('5492664840533@c.us', 'Crasheo el post /insterTicket\n' + err);
        console.log("error en post /insterTicket", err);
      }
      res.send(true);
    });
}



export const updateTicket =(req, res) => {
    const data = req.body;
    const idTicket = data.idTicket;
    const idContacto = data.idContacto;
    const categoria = data.categoria;
    const asignado = data.asignado;
    const descripcion = data.descripcion;
    const estado = data.estado;
    const prioridad = data.priorirdad;
    const comentario = data.comentario;
    const usuario = data.usuario;
    const fechaCreacion = data.fechaCreacion;
    const fechaProceso = data.fechaProceso;
    const area = data.area;
    const fechaCierre = data.fechaCierre;
  
    var sql =
      "UPDATE tickets SET idContacto = '" +
      idContacto +
      "', categoria = '" +
      categoria +
      "', asignado = '" +
      asignado +
      "', descripcionTicket = '" +
      descripcion +
      "', estado = '" +
      estado +
      "', prioridad = '" +
      prioridad +
      "', comentario = '" +
      comentario +
      "', usuario = '" +
      usuario +
      "', fechaCreacion = '" +
      fechaCreacion +
      "', fechaProceso = '" +
      fechaProceso +
      "', area = '" +
      area +
      "', fechaCierre = '" +
      fechaCierre +
      "' WHERE idTicket = '" +
      idTicket +
      "'";
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo el post /updateTicket\n" + err
        );
        return console.log("error en post /updateTicket", err);
      }
      res.send(true);
    });
  }

  export const areas = (req, res) => {
    var sql = "SELECT area FROM areas";
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo el get /consultas\n" + err
        );
        return console.log("error en areas");
      }
      res.send(result);
    });
  }