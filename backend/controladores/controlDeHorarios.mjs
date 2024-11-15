import { comprobarHoraMensajeAutomatico } from "./comprobarMensajeAutomatico.mjs";
import con from "../database/conexion.mjs";
export const controlDeHorarios = (interval) => {
    
    const sql = `SELECT c.idClienteActivo, c.telefono, c.rango, c.Fecha, c.bool, c.fechaMensaje, c.nuevoMensaje, c.comprobante, m.nombre, m.nombreUsuario
    FROM clientesactivo c
    JOIN (
      SELECT m.telefono, m.nombre, m.nombreUsuario
      FROM mensajes m
      WHERE m.idMensaje = (
        SELECT MAX(idMensaje)
        FROM mensajes
        WHERE telefono = m.telefono
      )
    ) AS m ON c.telefono = m.telefono`;
    
  try {
    con.query(sql, function (err, result) {
      if (err) {
        clearInterval(interval); // Detener el intervalo en caso de error
        client.sendMessage('5492664840533@c.us', 'Crasheo post /buscarPorRangoDeFechas\n' + err);
        return console.log("error en buscarPorRangoDeFechas");
      }
      const jsonResult = JSON.parse(JSON.stringify(result));
      jsonResult.forEach(value => {
        comprobarHoraMensajeAutomatico(value.Fecha, 9, value.bool, value.telefono, value.nombre, value.fechaMensaje, value.rango, value.nombreUsuario);
      });
    });
  } catch (e) {
    console.log(e);
  }
}