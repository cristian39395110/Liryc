export default (idNotify, con, client) => {
  const sql =
    "UPDATE notify SET enviado = '1' WHERE idNotify = '" + idNotify + "'";
  try {
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage(
          "5492664840533@c.us",
          "Crasheo post /updateEnviadoNotify\n" + err
        );
        return console.log("error en updateEnviadoNotify");
      }
    });
  } catch (e) {
    console.log(e);
  }
};
