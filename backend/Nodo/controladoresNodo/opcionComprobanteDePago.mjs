import { guardarNodoActual } from "./guardarNodoActual.mjs";
import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
import con from "../../database/conexion.mjs";
import axios from 'axios'
const client = obtenerClienteDeWhatsapp(colors, false)

function getCurrentDatePlus7Days() {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 7);

  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '0');

  return {ispDate: `${year}${month}${day}`, clienteDate: `${day}/${month}/${year}`};
}

export const opcionComprobanteDePago = (telefono, mensaje, opcion, menuFinal, otros, datos, tipoMensaje) => {
  // console.log(mensaje, 'mensaje en comprobante')
  if(opcion === 'blocked'){ //esta bloqueado y envia comprobante

  if(tipoMensaje !== 'chat'){
    setTimeout(() => {
      const url = 'http://localhost:5034/comprobanteDePago';
      const data = {
        customer_id: otros, 
        date : getCurrentDatePlus7Days().ispDate
      };
      // console.log(data, "antes de enviar")
      axios.post(url, data)
      .then(response => {
        // console.log(response.data, "respuesta desde comprobante de pago")
  if (response.data.result !== 'ok') {
      guardarNodoActual(telefono, "clienteConfirmaCbuError", "", datos, opcion, "", menuFinal, otros);
client.sendMessage(
telefono,
`*Registramos tu comprobante de pago* ✅
*No fue posible realizar un compromiso de pago* ❌


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
  
    guardarNodoActual(telefono, "facturaConfirmaIspOk", "", datos, 'enabled', "", menuFinal, otros);
  
client.sendMessage(
telefono,
`*Registramos tu comprobante de pago* ✅
*Realizamos un compromiso de pago hasta el dia ${getCurrentDatePlus7Days().clienteDate}* ✅`
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
  }else{
    guardarNodoActual(telefono, "clienteConfirmaCbuError", "", datos, opcion, "", menuFinal, otros);
client.sendMessage(
telefono,
`*No pudimos registrar tu comprobante* ❌
*Intenta nuevamente enviando una imagen, foto o archivo valido* 

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
  }
}else{ //esta habilitado y envia comprobante
  if(tipoMensaje !== 'chat'){
  guardarNodoActual(telefono, "facturaConfirmaIspOk", "", datos, opcion, "", menuFinal, otros);
client.sendMessage(
telefono,
`*¡Registramos tu comprobante de pago correctamente!* ✅`
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


  }else{
  guardarNodoActual(telefono, "clienteConfirmaCbuError", "", datos, opcion, "", menuFinal, otros);
client.sendMessage(
telefono,
`*No pudimos registrar tu comprobante* ❌
*Intenta nuevamente enviando una imagen, foto o archivo valido* 

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
  }
}
};
