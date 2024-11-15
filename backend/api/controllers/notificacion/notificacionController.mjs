import con from "../../../database/conexion.mjs"
import obtenerClienteDeWhatsapp from "../../../conexionWhatsapp/conexionW.js"
const client = obtenerClienteDeWhatsapp(null, false);
import difusionTest from "../../../controladores/difunsionTest.mjs"

export const difundirTest = (req, res) => {
  const data = req.body;
  const telefono = data.telefono;
  var sql = "SELECT * FROM contactos";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post /difundirTest\n" + err
      );
      return console.log("error en post /difundir");
    }
    difusionTest(req.body, result, telefono, client);
  });
};

export const deleteDifusion = (req, res) => {
  var sql = "DELETE FROM templatedifusion where id='" + req.body.id + "'";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post deleteDifusion\n" + err
      );
      return console.log("error en post deleteDifusion");
    }
    res.send(true);
  });
};

export const editarDifusion = (req, res) => {
  const data = req.body;
  var sql =
    "UPDATE templatedifusion SET mensaje = '" +
    data.mensaje +
    "', nombre='" +
    data.nombre +
    "' WHERE id = '" +
    data.id +
    "'";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post /editarDifusion\n" + err
      );
      return console.log("error en post /editarDifusion");
    }
    res.send(true);
  });
};

export const insertDifusion = (req, res) => {
  const data = req.body;

  var sql =
    "INSERT INTO templatedifusion(nombre,mensaje) VALUES('" +
    data.nombre +
    "','" +
    data.mensaje +
    "')";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el post /insertDifusion\n" + err
      );
      return console.log("error en post /insertDifusion");
    }
  });

  res.send(true);
};

export const getDifusion = (req, res) => {
  var sql = "SELECT * FROM templatedifusion";
  con.query(sql, function (err, result) {
    if (err) {
      client.sendMessage(
        "5492664840533@c.us",
        "Crasheo el get /getDifusion\n" + err
      );
      return console.log("error en get getDifusion");
    }
    res.send(result);
  });
};

export const getNotificaciones = (req, res) => {
  const sql =
    "SELECT n.idNotify, c.nombre, c.descripcion, c.direccion, c.urlPerfil, d.mensaje, c.telefono, n.fecha, n.enviado, n.usuario FROM notify n INNER JOIN templatedifusion d ON n.idTemplateDifusion = d.id INNER JOIN contactos c ON n.idContacto = c.idContacto ORDER BY n.idNotify desc";
  try {
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo post /getNotificaciones\n" + err
        );
        return console.log("error en getNotificaciones");
      }
      res.send(result);
    });
  } catch (e) {
    console.log(e);
  }
};

export const guardarConfiguracionNotify = (req, res) => {
  const data = req.body;
  // console.log(data);
  var fecha = data.fecha;
  var contactos = data.contactos;
  var idTemplate = data.template;
  var usuario = data.usuario;
  contactos.forEach((value) => {
    const sql =
      "INSERT INTO notify (idTemplateDifusion, idContacto, fecha, enviado, usuario)  VALUES( '" +
      idTemplate + "', '" + value.idContacto + "', '" + fecha +"', '0', '"+usuario+"' )";
    try {
      con.query(sql, function (err, result) {
        if (err) {
          client.sendMessage(
            "5492664840533@c.us",
            "Crasheo post /guardarConfiguracionNotify\n" + err
          );
          return console.log("error en guardarConfiguracionNotify");
        }
      });
    } catch (e) {
      console.log(e);
    }
  });

  res.send(true);
};

export const eliminarNotify = (req, res) => {
  const data = req.body;
  var idNotify = data.idNotify;
  const sql = "DELETE FROM notify WHERE idNotify = '" + idNotify + "'";
  try {
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo post /eliminarNotify\n" + err
        );
        return console.log("error en eliminarNotify");
      }
      res.send(true);
    });
  } catch (e) {
    console.log(e);
  }
};

