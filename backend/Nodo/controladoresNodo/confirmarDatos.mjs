import { guardarNodoActual } from "./guardarNodoActual.mjs";
import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
import con from "../../database/conexion.mjs";
const client = obtenerClienteDeWhatsapp(colors, false)

export const confirmarDatos = (telefono, mensaje, opcion, menuFinal, otros, datos) => {
  guardarNodoActual(telefono, "clienteConfirma", "", mensaje, opcion, "", menuFinal, otros);
//   setTimeout(() => {
//     let sql = "SELECT * FROM menucliente WHERE telefono = '" + telefono + "'";
//     con.query(sql, (err, result) => {
//       if (err) {
//         client.sendMessage(
//           "5492664840533@c.us",
//           "Crasheo el gestionMensajes\n" + err
//         );
//         return console.log("error en confirmarDatos");
//       }
//       if (result.length > 0) {
        
// client.sendMessage(
//   telefono,
// `Sus consulta es: *${result[0].datos}*
// Ha solicitado asistencia para: *${result[0].menuFinal}*
// ¿Es correcto?`
// );
        
        
//         client.sendMessage(
//           telefono,
//           "*_Por favor, elige una opción ingresando el número correspondiente:_*\n" +
//             "1️⃣ *SI, ENVIAR*\n" +
//             "2️⃣- *NO, SALIR*\n"
//         );
//       }
//     });
//   }, 1000);
};
