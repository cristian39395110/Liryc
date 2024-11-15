import { guardarNodoActual } from "./guardarNodoActual.mjs";
import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
import con from "../../database/conexion.mjs";
import axios from 'axios'
const client = obtenerClienteDeWhatsapp(colors, false)

export const mediosDePagoIspCube = (telefono, mensaje, opcion, menuFinal, otros, datos) => {
  
  setTimeout(() => {
    const url = 'http://172.19.3.85:5034/getCliente';
    const data = {
        documento: mensaje | datos,
    };
    console.log(data, "antes de enviar")
    axios.post(url, data)
    .then(response => {
if (JSON.stringify(response.data.cbu) === '{}') {
    guardarNodoActual(telefono, "clienteConfirmaCbuError", "", datos, opcion, "", menuFinal, otros);
client.sendMessage(
  telefono,
`*Actualmente no encontramos un cbu asociado a tu cuenta*

👩‍🦰 ¿En qué más te puedo ayudar?

*_Por favor, elige una opción ingresando el número correspondiente:_*
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Adherir a debito automático.
5️⃣ Informar promesa de pago.
6️⃣ Otras consultas

0️⃣ Volver al menú principal
`
);
}else{
    guardarNodoActual(telefono, "facturaConfirmaIspOk", "", datos, opcion, "", menuFinal, otros);

client.sendMessage(
  telefono,
`🏦 Su alias para hacer depósitos/transferencias en Siro es:
${response.data.cbu}
🚫 Recuerde que este alias es personal e intransferible.

También puede realizar pagos en Rapipago y Pago Fácil presentando su factura.`
);
setTimeout(() => {
client.sendMessage(
  telefono,
`👩‍🦰 ¿En qué más te puedo ayudar?

*_Por favor, elige una opción ingresando el número correspondiente:_*
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Adherir a debito automático.
5️⃣ Informar promesa de pago.
6️⃣ Otras consultas

0️⃣ Volver al menú principal
`
);
},1500)


}
// console.log('Respuesta de la API:', response.data);
        

// client.sendMessage(
//   telefono,
//   "*_Por favor, elige una opción ingresando el número correspondiente:_*\n" +
//     "1- *SI, ENVIAR*\n" +
//     "2- *NO, SALIR*\n"
// );
})
.catch(error => {
    return console.error('Error al hacer la petición:', error);
});


  }, 1000);
};
