import comprobarEnvioDeNotificacion from "./comprobarEnvioDeNotificacion.mjs"
export default (con, client) => {
  console.log("controlando notify");
  let ARRNOTIFICACIONES = [];
  const sql =
    "SELECT n.idNotify, d.mensaje, c.telefono, n.fecha, n.enviado FROM notify n INNER JOIN templatedifusion d ON n.idTemplateDifusion = d.id INNER JOIN contactos c ON n.idContacto = c.idContacto WHERE n.enviado = 0";
  try {
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo post /consultarNotify\n" + err
        );
        return console.log("error en consultarNotify");
      }
      if (result.length > 0) {
        ARRNOTIFICACIONES = JSON.parse(JSON.stringify(result));
        // console.log(ARRNOTIFICACIONES);
        comprobarEnvioDeNotificacion(ARRNOTIFICACIONES, con, client);
      }
    });
  } catch (e) {
    console.log(e);
  }
};
