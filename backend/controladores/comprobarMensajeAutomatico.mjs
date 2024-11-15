import insertDataMensaje from "./insertDataMensaje.mjs";
import con from "../database/conexion.mjs"; // Asegúrate de importar la conexión
import { promisify } from 'util';
export const comprobarHoraMensajeAutomatico = async (timestamp, minutosASumar, bool, telefono, nombre, fechaMensaje, rango, nombreUsuario) => {
  var mensaje = "";
  const query = promisify(con.query).bind(con);
  // Convertir el timestamp a minutos
  const minutos = Math.floor(timestamp / 60000); // Dividir por 60000 para convertir a minutos

  // Sumar la cantidad de minutos
  const minutosSumados = minutos + minutosASumar;

  // Obtener la hora actual
  const horaActual = new Date().getHours();
  const minutosActuales = new Date().getMinutes();

  // Comparar la cantidad sumada con la hora actual
  if (minutosSumados >= horaActual * 60 + minutosActuales && bool === 1) {
    if (bool === 1) {
      if (horaActual >= 0 && horaActual < 9) {
        mensaje = "Nuestro horario de atención es de Lunes a Sábados de 9:00 a 00:00 horas. En estos momentos no se encuentran operadores.";
      } else {
        mensaje = "Nuestros operadores están ocupados. Por favor, espere un momento y será atendido.";
      }

      const fechaAc = new Date();
      const diaAc = fechaAc.getDate();
      const mesAc = fechaAc.getMonth() + 1; // Sumar 1 para obtener el número de mes correcto
      const añoAc = fechaAc.getFullYear();
      const horaAc = fechaAc.getHours().toString().padStart(2, '0');
      const minutosAc = fechaAc.getMinutes().toString().padStart(2, '0');
      const segundosAc = fechaAc.getSeconds().toString().padStart(2, '0');

      const fechaBuscar = `${diaAc}-${mesAc}-${añoAc}`; // Formato: "7-6-2023"
      const fecha = `${diaAc}/${mesAc}/${añoAc} - ${horaAc}:${minutosAc}:${segundosAc}`; // Formato: "7/7/2023 - 16:53:10"
      const msj = {
        'mensaje': mensaje,
        'telefono': telefono,
        'nombre': nombre,
        'fecha': fecha,
        'fechaBuscar': fechaBuscar,
        'nombreUsuario': 'medusa',
        'rango': rango
      };
      const ultimoId = await query("SELECT MAX(idMensaje) as ultimoId FROM mensajes");
      const ultimoIdMensaje = ultimoId[0].ultimoId;
      insertDataMensaje(msj, 2, rango, '', rango, rango, true, ultimoIdMensaje);

      // Ejecutar la consulta UPDATE para cambiar el valor de bool a 0
      const updateSql = `UPDATE clientesactivo SET bool = 0 WHERE telefono = '${telefono}'`;
      await query(updateSql, (updateErr) => {
        if (updateErr) {
          console.log("Error actualizando bool:", updateErr);
        } else {
          console.log(`Bool actualizado a 0 para el teléfono: ${telefono}`);
        }
      });
    }
  }
};