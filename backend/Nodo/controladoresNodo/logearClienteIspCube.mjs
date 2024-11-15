// import { guardarNodoActual } from "./guardarNodoActual.mjs";
// import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
// import colors from 'colors/safe.js'
// import con from "../../database/conexion.mjs";
// import axios from 'axios'
// import {limpiarTelefonoMenuCliente} from "./limpiarTelefonoMenuCliente.mjs"
// import { comprobarTelefono } from "../../controladores/comprobarTelefono.mjs"
// const client = obtenerClienteDeWhatsapp(colors, false)

// export const logearClienteIspCube = (telefono, mensaje, opcion, menuFinal, otros, datos) => {
  
//   setTimeout(() => {
//     const url = 'http://172.19.3.85:5001/getCliente';
//     const regex = /^\d+$/;
//     if(!regex.test(mensaje)){
//       mensaje = mensaje.replace(/\D/g, '');
//     }
//     if(!regex.test(datos)){
//       datos = datos.replace(/\D/g, '');
//     }
//     const data = {
//         documento: mensaje || datos,
//     };
//     // console.log(data, "antes de enviar")
//     axios.post(url, data)
//     .then(response => {
// if (response.data.message === 'Cliente no encontrado' || response.data.phone === '') {
//   guardarNodoActual(telefono, "clienteConfirmaIspError", "", "", opcion, "", menuFinal, otros);
// client.sendMessage(
//   telefono,
// `*Estoy teniendo algunos problemas para encontrar tu número de documento.*
// *Para asegurarte la mejor atención, te voy a derivar a un operador para que pueda asistirte.*

// *En minutos se pondrán en contacto con vos!*
// *Te saluda tu asistente de Sidecom 👩‍🦰*
// `
// );
// comprobarTelefono(telefono, 'cobranza');
// limpiarTelefonoMenuCliente(telefono);
// }else{
//   guardarNodoActual(telefono, "clienteConfirmaIspOk", "", mensaje, response.data.status, "", menuFinal, response.data.id);
// let datos = response.data;
// client.sendMessage(
//   telefono,
// `*Hola ${datos.name}!*
// El estado de su cuenta es: *${datos.debt !== '0.00' ? '$'+datos.debt : '$'+datos.duedebt}*
// El estado de tu servicio es: *${datos.status === 'enabled' ? 'Conectado ✅' : datos.status === 'blocked' ? 'Suspendido por falta de pago ⛔' : 'Sin conexion ❌'}*
// `
// );
// setTimeout(() => {
// client.sendMessage(
//   telefono,
// `¿En que puedo ayudarte?

// *_por favor elige una opción ingresando el número correspondiente:_*
// 1️⃣ ADMINISTRACION/FACTURACION
// 2️⃣ VENTAS
// 3️⃣ SOPORTE TECNICO
// `
// );
// },500)


// }
// // console.log('Respuesta de la API:', response.data);
        

// // client.sendMessage(
// //   telefono,
// //   "*_Por favor, elige una opción ingresando el número correspondiente:_*\n" +
// //     "1- *SI, ENVIAR*\n" +
// //     "2- *NO, SALIR*\n"
// // );
// })
// .catch(error => {
//   guardarNodoActual(telefono, "clienteConfirmaIspError", "", "", opcion, "", menuFinal, otros);
//   client.sendMessage(
//     telefono,
//   `*Estoy teniendo algunos problemas para encontrar tu número de documento.*
//   *Para asegurarte la mejor atención, te voy a derivar a un operador para que pueda asistirte.*
  
//   *En minutos se pondrán en contacto con vos!*
//   *Te saluda tu asistente de Sidecom 👩‍🦰*
//   `
//   );
//   comprobarTelefono(telefono, 'cobranza');
//   limpiarTelefonoMenuCliente(telefono);
//     return console.error('Error al hacer la petición:', error);
// });


//   }, 1000);
// };

import { guardarNodoActual } from "./guardarNodoActual.mjs";
import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
import con from "../../database/conexion.mjs";
import axios from 'axios'
const client = obtenerClienteDeWhatsapp(colors, false)

export const logearClienteIspCube = async (telefono, mensaje, datos) => {
  const url = 'http://localhost:5001/getCliente';
  const regex = /^\d+$/;

  mensaje = !regex.test(mensaje) ? mensaje.replace(/\D/g, '') : mensaje;
  datos = !regex.test(datos) ? datos.replace(/\D/g, '') : datos;

  const data = {
    documento: mensaje || datos,
  };

  try {
    const response = await axios.post(url, data);

    if (response.data.message === 'Cliente no encontrado' || response.data.phone === '') {
      return { success: false, error: 'Cliente no encontrado' };
    } else {
      // Retornar la data del cliente si lo encontro
      return { success: true, clientData: response.data };
    }

  } catch (error) {
    console.error('Error al hacer la petición:', error);
    // Retornar error
    return { success: false, error: 'Error al hacer la petición' };
  }
};

